import express from "express";
import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Get a single inventory item by MongoDB
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid inventory ID.",
            });
        }

        const inventory = await Inventory.findById(id);

        if (!inventory) {
            return res.status(404).json({
                message: "Inventory item not found.",
            });
        }

        res.status(200).json(inventory);
    } catch (error) {
        console.error(
            "Failed to fetch inventory item:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch inventory item.",
        });
    }
});

// Search/ filter All inventory
router.get ("/", async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        const filter = {};

        // Category filter
        if (category && category.toLowerCase() !== "all") {
            filter.category = new RegExp(`^${category}$`, "i");
        }

        // Search filter
        if (search) {
            const searchRegex = new RegExp(search, "i");

            filter.$or = [
                { name: searchRegex },
                { brand: searchRegex },
                { specs: searchRegex },
            ];
        }

        // Sorting
        let query = Inventory.find(filter);

        if (sort === "low") {
            query = query.sort({price: 1});
        }
        
        if (sort === "high") {
            query = query.sort({price: -1});
        }
        
        const inventory = await query;

        res.status(200).json(inventory);
    } catch (error) {
        console.error ("Failed to fetch inventory: ", error.message);

        res.status(500).json({
            message: "Failed to fetch inventory",
        });
    }
});

export default router;