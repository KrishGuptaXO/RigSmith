import express from "express";
import mongoose from "mongoose";
import Inventory from "../../models/Inventory.js";
import Build from "../../models/Build.js";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import Supplier from "../../models/supplier.js";
import {
    HttpError,
    LOW_STOCK_THRESHOLD,
    escapeRegex,
    handleError,
    isValidObjectId,
    parsePagination,
} from "../../utils/helper.js";
import { validateInventoryInput } from "../../utils/inventoryValidation.js";

const router = express.Router();

const assertSupplierExists = async (supplierId) => {
    if (!supplierId) return;
    if (!isValidObjectId(String(supplierId)) || !(await Supplier.exists({ _id: supplierId }))) {
        throw new HttpError(400, "Selected supplier does not exist.");
    }
};

// GET /api/admin/inventory?search=&category=&stock=all|out|low|in&page=&limit=
router.get("/", async (req, res) => {
    try {
        const { search, category, stock } = req.query;
        const { page, limit, skip } = parsePagination(req.query);
        const filter = {};

        if (category && category.toLowerCase() !== "all") {
            filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
        }

        if (search) {
            const rx = new RegExp(escapeRegex(search), "i");
            filter.$or = [{ name: rx }, { brand: rx }, { specs: rx }];
        }

        if (stock === "out") filter.stock = 0;
        else if (stock === "low") filter.stock = { $gt: 0, $lte: LOW_STOCK_THRESHOLD };
        else if (stock === "in") filter.stock = { $gt: LOW_STOCK_THRESHOLD };

        const [items, total] = await Promise.all([
            Inventory.find(filter)
                .populate("supplierId", "name")
                .sort({ category: 1, name: 1 })
                .skip(skip)
                .limit(limit),
            Inventory.countDocuments(filter),
        ]);

        res.status(200).json({
            items,
            total,
            page,
            pages: Math.max(Math.ceil(total / limit), 1),
            lowStockThreshold: LOW_STOCK_THRESHOLD,
        });
    } catch (error) {
        handleError(res, error, "Failed to fetch inventory.");
    }
});

// POST /api/admin/inventory
router.post("/", async (req, res) => {
    try {
        const data = validateInventoryInput(req.body);
        await assertSupplierExists(data.supplierId);

        // `id` is a required, unique numeric field on the existing model: assign next one.
        const last = await Inventory.findOne().sort({ id: -1 }).select("id");
        data.id = (last?.id ?? 0) + 1;

        const item = await Inventory.create(data);
        res.status(201).json(item);
    } catch (error) {
        handleError(res, error, "Failed to create inventory item.");
    }
});

// PUT /api/admin/inventory/:id  (only whitelisted fields are updatable)
router.put("/:id", async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid inventory ID.");

        const data = validateInventoryInput(req.body, { partial: true });
        await assertSupplierExists(data.supplierId);

        const item = await Inventory.findByIdAndUpdate(
            req.params.id,
            { $set: data },
            { new: true, runValidators: true }
        );
        if (!item) throw new HttpError(404, "Inventory item not found.");

        res.status(200).json(item);
    } catch (error) {
        handleError(res, error, "Failed to update inventory item.");
    }
});

// PATCH /api/admin/inventory/:id/stock  { stock } sets an absolute value, { adjustBy } applies a delta
router.patch("/:id/stock", async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid inventory ID.");

        const { stock, adjustBy } = req.body;
        let item;

        if (stock !== undefined) {
            const v = Number(stock);
            if (stock === "" || !Number.isInteger(v) || v < 0) {
                throw new HttpError(400, "stock must be a whole number 0 or greater.");
            }
            item = await Inventory.findByIdAndUpdate(req.params.id, { $set: { stock: v } }, { new: true });
        } else if (adjustBy !== undefined) {
            const d = Number(adjustBy);
            if (!Number.isInteger(d) || d === 0) {
                throw new HttpError(400, "adjustBy must be a non-zero whole number.");
            }
            // Atomic guard: never let stock go below zero, even with concurrent checkouts.
            item = await Inventory.findOneAndUpdate(
                { _id: req.params.id, ...(d < 0 ? { stock: { $gte: -d } } : {}) },
                { $inc: { stock: d } },
                { new: true }
            );
            if (!item && (await Inventory.exists({ _id: req.params.id }))) {
                throw new HttpError(409, "Not enough stock for that adjustment.");
            }
        } else {
            throw new HttpError(400, "Provide stock or adjustBy.");
        }

        if (!item) throw new HttpError(404, "Inventory item not found.");
        res.status(200).json(item);
    } catch (error) {
        handleError(res, error, "Failed to update stock.");
    }
});

// DELETE /api/admin/inventory/:id
// Blocked while a Featured Build uses the item (would break checkout for that build).
// Otherwise removes it and cleans carts/wishlists. Past orders keep their own name/price snapshot.
router.delete("/:id", async (req, res) => {
    const session = await mongoose.startSession();
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid inventory ID.");

        const usedBy = await Build.find({ "components.inventoryId": req.params.id }).select("name");
        if (usedBy.length) {
            throw new HttpError(
                409,
                `Cannot delete: used by Featured Build(s): ${usedBy.map((b) => b.name).join(", ")}.`
            );
        }

        let deleted = null;
        await session.withTransaction(async () => {
            deleted = await Inventory.findByIdAndDelete(req.params.id, { session });
            if (!deleted) return;
            await Cart.updateMany({}, { $pull: { items: { inventoryId: deleted._id } } }, { session });
            await User.updateMany({}, { $pull: { inventoryWishlist: deleted._id } }, { session });
        });

        if (!deleted) throw new HttpError(404, "Inventory item not found.");
        res.status(200).json({ message: "Inventory item deleted.", id: deleted._id });
    } catch (error) {
        handleError(res, error, "Failed to delete inventory item.");
    } finally {
        session.endSession();
    }
});

export default router;