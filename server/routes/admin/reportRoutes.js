import express from "express";
import Inventory from "../../models/Inventory.js";
import Order from "../../models/Order.js";
import { HttpError, LOW_STOCK_THRESHOLD, handleError } from "../../utils/helper.js";

const router = express.Router();

const parseDate = (value, label) => {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) throw new HttpError(400, `${label} is not a valid date.`);
    return d;
};

// GET /api/admin/reports?from=YYYY-MM-DD&to=YYYY-MM-DD
//
// Definitions:
//  - placedValue     = sum of totalAmount of all orders that are NOT cancelled
//                      (pending..shipped are still open, so this is value booked, not cash received)
//  - completedSales  = sum of totalAmount of orders with status "delivered"
//  - cancelledValue  = sum of totalAmount of cancelled orders (excluded from placedValue)
//  - inventoryValue  = sum(price * stock) at RigSmith selling price (no cost price is stored)
// from/to only filter order figures (by createdAt); inventory figures are always current.
router.get("/", async (req, res) => {
    try {
        const from = parseDate(req.query.from, "from");
        const to = parseDate(req.query.to, "to");
        if (to) to.setHours(23, 59, 59, 999);

        const orderMatch = {};
        if (from || to) {
            orderMatch.createdAt = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
        }

        const [byStatus, topProducts, valueByCategory, lowStock] = await Promise.all([
            Order.aggregate([
                { $match: orderMatch },
                { $group: { _id: "$status", count: { $sum: 1 }, value: { $sum: "$totalAmount" } } },
            ]),
            Order.aggregate([
                { $match: { ...orderMatch, status: { $ne: "cancelled" } } },
                { $unwind: "$items" },
                { $match: { "items.itemType": "inventory" } },
                {
                    $group: {
                        _id: "$items.inventoryId",
                        name: { $last: "$items.name" },
                        unitsSold: { $sum: "$items.quantity" },
                        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    },
                },
                { $sort: { unitsSold: -1 } },
                { $limit: 5 },
            ]),
            Inventory.aggregate([
                {
                    $group: {
                        _id: "$category",
                        items: { $sum: 1 },
                        units: { $sum: "$stock" },
                        value: { $sum: { $multiply: ["$price", "$stock"] } },
                    },
                },
                { $sort: { value: -1 } },
            ]),
            Inventory.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
                .sort({ stock: 1, name: 1 })
                .select("name category stock price"),
        ]);

        const get = (s) => byStatus.find((r) => r._id === s) || { count: 0, value: 0 };
        const open = byStatus.filter((r) => r._id !== "cancelled");

        res.status(200).json({
            range: { from, to },
            orders: {
                total: byStatus.reduce((a, r) => a + r.count, 0),
                byStatus: Object.fromEntries(byStatus.map((r) => [r._id, r.count])),
                placedValue: open.reduce((a, r) => a + r.value, 0),
                completedSales: get("delivered").value,
                completedCount: get("delivered").count,
                cancelledValue: get("cancelled").value,
                cancelledCount: get("cancelled").count,
            },
            inventory: {
                totalValue: valueByCategory.reduce((a, r) => a + r.value, 0),
                byCategory: valueByCategory.map((r) => ({
                    category: r._id,
                    items: r.items,
                    units: r.units,
                    value: r.value,
                })),
                lowStockThreshold: LOW_STOCK_THRESHOLD,
                lowStock,
            },
            topProducts: topProducts.map((p) => ({
                inventoryId: p._id,
                name: p.name,
                unitsSold: p.unitsSold,
                revenue: p.revenue,
            })),
        });
    } catch (error) {
        handleError(res, error, "Failed to generate reports.");
    }
});

export default router;