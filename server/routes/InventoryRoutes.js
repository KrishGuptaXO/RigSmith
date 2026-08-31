import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

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