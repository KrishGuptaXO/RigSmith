import express from "express";
import Inventory from "../../models/Inventory.js";
import { HttpError, escapeRegex, handleError } from "../../utils/helper.js";

const router = express.Router();

// Categories are not a separate collection: they are the `category` string on
// Inventory documents. These endpoints list and rename them without adding a
// duplicate category system. A category exists while at least one item uses it
// (create one by adding an inventory item with a new category name).

// GET /api/admin/categories -> [{ name, itemCount, totalStock }]
router.get("/", async (req, res) => {
    try {
        const rows = await Inventory.aggregate([
            { $group: { _id: "$category", itemCount: { $sum: 1 }, totalStock: { $sum: "$stock" } } },
            { $sort: { _id: 1 } },
        ]);
        res.status(200).json(
            rows.map((r) => ({ name: r._id, itemCount: r.itemCount, totalStock: r.totalStock }))
        );
    } catch (error) {
        handleError(res, error, "Failed to fetch categories.");
    }
});

// PUT /api/admin/categories/rename  { from, to }
router.put("/rename", async (req, res) => {
    try {
        const from = typeof req.body.from === "string" ? req.body.from.trim() : "";
        const to = typeof req.body.to === "string" ? req.body.to.trim() : "";

        if (!from || !to) throw new HttpError(400, "Both from and to are required.");
        if (to.length > 100) throw new HttpError(400, "Category name is too long.");
        if (from === to) throw new HttpError(400, "New name matches the current name.");

        if (!(await Inventory.exists({ category: from }))) {
            throw new HttpError(404, "Category not found.");
        }

        // Case-insensitive clash check so "gpu" and "GPU" don't become two categories.
        const clash = await Inventory.exists({
            category: new RegExp(`^${escapeRegex(to)}$`, "i"),
            $expr: { $ne: ["$category", from] },
        });
        if (clash) throw new HttpError(409, "A category with that name already exists.");

        const result = await Inventory.updateMany({ category: from }, { $set: { category: to } });
        res.status(200).json({ message: "Category renamed.", modified: result.modifiedCount });
    } catch (error) {
        handleError(res, error, "Failed to rename category.");
    }
});

export default router;