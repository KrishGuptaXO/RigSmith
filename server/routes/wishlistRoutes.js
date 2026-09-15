import express from "express";
import User from "../models/User.js";
import Build from "../models/Build.js";
import Inventory from "../models/Inventory.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/wishlist
// Get both build and inventory wishlists
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate("buildWishlist")
            .populate("inventoryWishlist");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        res.status(200).json({
            builds: user.buildWishlist,
            inventory: user.inventoryWishlist,
        });
    } catch (error) {
        console.error(
            "Failed to fetch wishlist:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch wishlist.",
        });
    }
});

// POST /api/wishlist/build/:buildId
// Add a build to the wishlist
router.post(
    "/build/:buildId",
    authMiddleware,
    async (req, res) => {
        try {
            const { buildId } = req.params;

            const build = await Build.findById(buildId);

            if (!build) {
                return res.status(404).json({
                    message: "Build not found.",
                });
            }

            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                });
            }

            if (
                user.buildWishlist.some(
                    (id) => id.toString() === buildId
                )
            ) {
                return res.status(409).json({
                    message: "Build is already in your wishlist.",
                });
            }

            user.buildWishlist.push(buildId);

            await user.save();

            res.status(201).json({
                message: "Build added to wishlist.",
                buildId,
            });
        } catch (error) {
            console.error(
                "Failed to add wishlist build:",
                error.message
            );

            res.status(500).json({
                message: "Failed to add build to wishlist.",
            });
        }
    }
);

// DELETE /api/wishlist/build/:buildId
// Remove a build from the wishlist
router.delete(
    "/build/:buildId",
    authMiddleware,
    async (req, res) => {
        try {
            const { buildId } = req.params;

            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                });
            }

            user.buildWishlist = user.buildWishlist.filter(
                (id) => id.toString() !== buildId
            );

            await user.save();

            res.status(200).json({
                message: "Build removed from wishlist.",
                buildId,
            });
        } catch (error) {
            console.error(
                "Failed to remove wishlist build:",
                error.message
            );

            res.status(500).json({
                message: "Failed to remove build from wishlist.",
            });
        }
    }
);

// POST /api/wishlist/inventory/:inventoryId
// Add an inventory item to the wishlist
router.post(
    "/inventory/:inventoryId",
    authMiddleware,
    async (req, res) => {
        try {
            const { inventoryId } = req.params;

            const inventoryItem =
                await Inventory.findById(inventoryId);

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

            if (
                user.inventoryWishlist.some(
                    (id) => id.toString() === inventoryId
                )
            ) {
                return res.status(409).json({
                    message:
                        "Inventory item is already in your wishlist.",
                });
            }

            user.inventoryWishlist.push(inventoryId);

            await user.save();

            res.status(201).json({
                message: "Inventory item added to wishlist.",
                inventoryId,
            });
        } catch (error) {
            console.error(
                "Failed to add inventory wishlist item:",
                error.message
            );

            res.status(500).json({
                message:
                    "Failed to add inventory item to wishlist.",
            });
        }
    }
);

// DELETE /api/wishlist/inventory/:inventoryId
// Remove an inventory item from the wishlist
router.delete(
    "/inventory/:inventoryId",
    authMiddleware,
    async (req, res) => {
        try {
            const { inventoryId } = req.params;

            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                });
            }

            user.inventoryWishlist =
                user.inventoryWishlist.filter(
                    (id) => id.toString() !== inventoryId
                );

            await user.save();

            res.status(200).json({
                message: "Inventory item removed from wishlist.",
                inventoryId,
            });
        } catch (error) {
            console.error(
                "Failed to remove inventory wishlist item:",
                error.message
            );

            res.status(500).json({
                message:
                    "Failed to remove inventory item from wishlist.",
            });
        }
    }
);

export default router;