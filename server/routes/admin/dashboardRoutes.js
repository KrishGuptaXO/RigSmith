import express from "express";
import Inventory from "../../models/Inventory.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { LOW_STOCK_THRESHOLD, handleError } from "../../utils/helper.js";

const router = express.Router();

// GET /api/admin/dashboard  (all numbers come straight from the database)
router.get("/", async (req, res) => {
    try {
        const [
            inventoryAgg,
            lowStock,
            outOfStock,
            ordersByStatus,
            customers,
            recentOrders,
            lowStockItems,
        ] = await Promise.all([
            Inventory.aggregate([
                { $group: { _id: null, items: { $sum: 1 }, units: { $sum: "$stock" } } },
            ]),
            Inventory.countDocuments({ stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } }),
            Inventory.countDocuments({ stock: 0 }),
            Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            User.countDocuments({ role: "customer" }),
            Order.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name email"),
            Inventory.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
                .sort({ stock: 1, name: 1 })
                .limit(5)
                .select("name category stock"),
        ]);

        const statusCounts = Object.fromEntries(ordersByStatus.map((r) => [r._id, r.count]));

        res.status(200).json({
            inventory: {
                items: inventoryAgg[0]?.items || 0,
                units: inventoryAgg[0]?.units || 0,
                lowStock,
                outOfStock,
                lowStockThreshold: LOW_STOCK_THRESHOLD,
            },
            orders: {
                total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
                byStatus: statusCounts,
            },
            customers,
            recentOrders,
            lowStockItems,
        });
    } catch (error) {
        handleError(res, error, "Failed to load dashboard.");
    }
});

export default router;