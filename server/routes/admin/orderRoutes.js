import express from "express";
import mongoose from "mongoose";
import Order from "../../models/Order.js";
import Inventory from "../../models/Inventory.js";
import Build from "../../models/Build.js";
import User from "../../models/User.js";
import {
    HttpError,
    escapeRegex,
    handleError,
    isValidObjectId,
    parsePagination,
} from "../../utils/helper.js";
import { ORDER_STATUSES, ORDER_TRANSITIONS, canTransition } from "../../utils/orderStatus.js";

const router = express.Router();

// GET /api/admin/orders?search=&status=&page=&limit=
router.get("/", async (req, res) => {
    try {
        const { search, status } = req.query;
        const { page, limit, skip } = parsePagination(req.query);
        const filter = {};

        if (status && status !== "all") {
            if (!ORDER_STATUSES.includes(status)) throw new HttpError(400, "Invalid status filter.");
            filter.status = status;
        }

        if (search) {
            const rx = new RegExp(escapeRegex(search), "i");
            const matchedUsers = await User.find({ $or: [{ name: rx }, { email: rx }] }).select("_id");
            filter.$or = [
                { orderNumber: rx },
                { "shippingAddress.name": rx },
                { userId: { $in: matchedUsers.map((u) => u._id) } },
            ];
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("userId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments(filter),
        ]);

        res.status(200).json({
            orders,
            total,
            page,
            pages: Math.max(Math.ceil(total / limit), 1),
            transitions: ORDER_TRANSITIONS,
        });
    } catch (error) {
        handleError(res, error, "Failed to fetch orders.");
    }
});

// GET /api/admin/orders/:id
router.get("/:id", async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid order ID.");

        const order = await Order.findById(req.params.id).populate("userId", "name email");
        if (!order) throw new HttpError(404, "Order not found.");

        res.status(200).json({ order, transitions: ORDER_TRANSITIONS });
    } catch (error) {
        handleError(res, error, "Failed to fetch order.");
    }
});

// Stock is deducted at checkout, so cancelling returns it. Runs inside the caller's transaction.
const restockOrder = async (order, session) => {
    const warnings = [];

    for (const item of order.items) {
        if (item.itemType === "inventory" && item.inventoryId) {
            const r = await Inventory.updateOne(
                { _id: item.inventoryId },
                { $inc: { stock: item.quantity } },
                { session }
            );
            if (!r.matchedCount) warnings.push(`"${item.name}" no longer exists in inventory; not restocked.`);
        } else if (item.itemType === "build" && item.buildId) {
            // Orders store only the build id, so this uses the build's CURRENT components.
            const build = await Build.findById(item.buildId).session(session);
            if (!build) {
                warnings.push(`Build "${item.name}" no longer exists; its components were not restocked.`);
                continue;
            }
            for (const c of build.components) {
                const r = await Inventory.updateOne(
                    { _id: c.inventoryId },
                    { $inc: { stock: c.quantity * item.quantity } },
                    { session }
                );
                if (!r.matchedCount) warnings.push(`A component of "${item.name}" no longer exists; not restocked.`);
            }
        }
    }

    return warnings;
};

// PATCH /api/admin/orders/:id/status  { status }
router.patch("/:id/status", async (req, res) => {
    const session = await mongoose.startSession();
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid order ID.");

        const next = req.body.status;
        if (!ORDER_STATUSES.includes(next)) throw new HttpError(400, "Invalid status.");

        let updated;
        let warnings = [];

        await session.withTransaction(async () => {
            const order = await Order.findById(req.params.id).session(session);
            if (!order) throw new HttpError(404, "Order not found.");

            if (!canTransition(order.status, next)) {
                throw new HttpError(409, `Cannot change an order from "${order.status}" to "${next}".`);
            }

            // Conditional on the status we just read: if two admins race, only one wins,
            // so stock can never be restored twice for the same cancellation.
            updated = await Order.findOneAndUpdate(
                { _id: order._id, status: order.status },
                { $set: { status: next } },
                { new: true, session }
            );
            if (!updated) throw new HttpError(409, "Order was changed by someone else. Refresh and retry.");

            warnings = next === "cancelled" ? await restockOrder(order, session) : [];
        });

        res.status(200).json({ message: `Order marked ${next}.`, order: updated, warnings });
    } catch (error) {
        handleError(res, error, "Failed to update order status.");
    } finally {
        session.endSession();
    }
});

export default router;