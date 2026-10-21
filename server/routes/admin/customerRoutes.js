import express from "express";
import User from "../../models/User.js";
import Order from "../../models/Order.js";
import {
    HttpError,
    escapeRegex,
    handleError,
    isValidObjectId,
    parsePagination,
} from "../../utils/helper.js";

const router = express.Router();

// Explicit allow-list of fields: password hashes and wishlists are never returned.
const SAFE_FIELDS = "name email role createdAt updatedAt";

const spendByUser = async (userIds) => {
    const rows = await Order.aggregate([
        { $match: { userId: { $in: userIds }, status: { $ne: "cancelled" } } },
        { $group: { _id: "$userId", orderCount: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } },
    ]);
    return new Map(rows.map((r) => [String(r._id), r]));
};

// GET /api/admin/customers?search=&role=customer|partner|admin|all&page=&limit=
router.get("/", async (req, res) => {
    try {
        const { search, role = "customer" } = req.query;
        const { page, limit, skip } = parsePagination(req.query);
        const filter = {};

        if (role !== "all") {
            if (!["customer", "partner", "admin"].includes(role)) {
                throw new HttpError(400, "Invalid role filter.");
            }
            filter.role = role;
        }

        if (search) {
            const rx = new RegExp(escapeRegex(search), "i");
            filter.$or = [{ name: rx }, { email: rx }];
        }

        const [users, total] = await Promise.all([
            User.find(filter).select(SAFE_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            User.countDocuments(filter),
        ]);

        const spend = await spendByUser(users.map((u) => u._id));
        const customers = users.map((u) => ({
            ...u,
            orderCount: spend.get(String(u._id))?.orderCount || 0,
            totalSpent: spend.get(String(u._id))?.totalSpent || 0,
        }));

        res.status(200).json({ customers, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
    } catch (error) {
        handleError(res, error, "Failed to fetch customers.");
    }
});

// GET /api/admin/customers/:id  (profile + their recent orders)
router.get("/:id", async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid customer ID.");

        const user = await User.findById(req.params.id).select(SAFE_FIELDS).lean();
        if (!user) throw new HttpError(404, "Customer not found.");

        const [orders, spend] = await Promise.all([
            Order.find({ userId: user._id })
                .sort({ createdAt: -1 })
                .limit(10)
                .select("orderNumber status totalAmount createdAt"),
            spendByUser([user._id]),
        ]);

        res.status(200).json({
            ...user,
            orderCount: spend.get(String(user._id))?.orderCount || 0,
            totalSpent: spend.get(String(user._id))?.totalSpent || 0,
            recentOrders: orders,
        });
    } catch (error) {
        handleError(res, error, "Failed to fetch customer.");
    }
});

export default router;