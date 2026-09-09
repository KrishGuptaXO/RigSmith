import express from "express";
import User from "../models/User.js";
import Inventory from "../models/Inventory.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET api/wishlist
// Get the current user's wishlist
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate("wishlist");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error("Failed to fetch wishlist: ", error.message);

        res.status(500).json({
            message: "Failed to fetch wishlist.",
        });
    }
});

// POST /api/wishlist/:inventoryId
// Add an inventory item to the wishlist
router.post("/:inventoryId", authMiddleware, async (req, res) => {
    try {
        const { inventoryId } = req.params;

        const inventoryItem = await Inventory.findById(inventoryId);

        if (!inventoryItem) {
            return res.status(404).json({
                message: "Inventory item not found.",
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        if (user.wishlist.includes(inventoryId)) {
            return res.status(409).json({
                message: "Item is already in your wishlist.",
            });
        }

        user.wishlist.push(inventoryId);
        await user.save();

        res.status(201).json({
            message: "Item added to wishlist.",
            inventoryId,
        });
    } catch (error) {
        console.error("Failed to add wishlist item:", error.message);

        res.status(500).json({
            message: "Failed to add item to wishlist",
        });
    }
});

// DELETE /api/wishlist/:inventoryId
// Remove an inventory item from the wishlist
router.delete("/:inventoryId", authMiddleware, async (req, res) => {
    try {
        const { inventoryId } = req.params;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        user.wishlist = user.wishlist.filter(
            (item) => item.toString() !== inventoryId
        );

        await user.save();

        res.status(200).json({
            message: "Item removed from wishlist.",
            inventoryId,
        });
    } catch (error) {
        console.error("Failed to remove wishlist item: ", error.message);

        res.status(500).json({
            message: "Failed to remove item from wishlist.",
        });
    }
});

export default router;