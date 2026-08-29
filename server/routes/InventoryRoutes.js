import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Search/ filter All inventory
router.get ("/", async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        console.log("Inventory query:", req.query);
        console.log("Sort value:", sort);
        
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
            console.log("Applying LOW → HIGH sort");
            query = query.sort({price: 1});
        }
        
        if (sort === "high") {
            console.log("Applying H → L sort");
            query = query.sort({price: -1});
        }
        
        const inventory = await query;
        console.log(
            "Result order:",
            inventory.map((product) => `${product.name} - ${product.price}`)
        );

        res.status(200).json(inventory);
    } catch (error) {
        console.error ("Failed to fetch inventory: ", error.message);

        res.status(500).json({
            message: "Failed to fetch inventory",
        });
    }
});

export default router;