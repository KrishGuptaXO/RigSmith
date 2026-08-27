import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// GET all inventory
router.get ("/", async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        console.error ("Failed to fetch inventory: ", error.message);
        res.status(500).json({
            message: "Failed to fetch inventory",
        });
    }
});

export default router;