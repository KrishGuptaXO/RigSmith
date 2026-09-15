import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Inventory from "../models/Inventory.js";
import Build from "../models/Build.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// GET /api/cart
router.get("/", async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.userId })
            .populate("items.inventoryId")
            .populate({
                path: "items.buildId",
                populate: {
                    path: "components.inventoryId",
                },
            });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.userId,
                items: [],
            });
        }

        res.json(cart);
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
});

// POST /api/cart
router.post("/", async (req, res) => {
    try {
        const {
            itemType,
            inventoryId,
            buildId,
            quantity = 1,
            customizations = "",
        } = req.body;

        if (!["inventory", "build"].includes(itemType)) {
            return res.status(400).json({
                message: "Invalid item type",
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer",
            });
        }

        // Validate the item being added
        if (itemType === "inventory") {
            if (
                !inventoryId ||
                !mongoose.Types.ObjectId.isValid(inventoryId)
            ) {
                return res.status(400).json({
                    message: "Invalid inventory ID",
                });
            }

            const inventoryItem = await Inventory.findById(inventoryId);

            if (!inventoryItem) {
                return res.status(404).json({
                    message: "Inventory item not found",
                });
            }
        }

        if (itemType === "build") {
            if (!buildId || !mongoose.Types.ObjectId.isValid(buildId)) {
                return res.status(400).json({
                    message: "Invalid build ID",
                });
            }

            const build = await Build.findById(buildId);

            if (!build) {
                return res.status(404).json({
                    message: "Build not found",
                });
            }
        }

        let cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.userId,
                items: [],
            });
        }

        // Find existing matching item
        const existingItem = cart.items.find((item) => {
            if (itemType === "inventory") {
                return (
                    item.itemType === "inventory" &&
                    item.inventoryId?.toString() === inventoryId
                );
            }

            return (
                item.itemType === "build" &&
                item.buildId?.toString() === buildId
            );
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                itemType,
                inventoryId: itemType === "inventory" ? inventoryId : null,
                buildId: itemType === "build" ? buildId : null,
                quantity,
                customizations,
            });
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.inventoryId")
            .populate({
                path: "items.buildId",
                populate: {
                    path: "components.inventoryId",
                },
            });

        res.json(updatedCart);
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            message: "Failed to add item to cart",
        });
    }
});

// PATCH /api/cart/:itemId
router.patch("/:itemId", async (req, res) => {
    try {
        const { quantity, itemType } = req.body;
        const { itemId } = req.params;

        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer",
            });
        }

        if (!["inventory", "build"].includes(itemType)) {
            return res.status(400).json({
                message: "Invalid item type",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                message: "Invalid item ID",
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex((item) => {
            if (itemType === "inventory") {
                return (
                    item.itemType === "inventory" &&
                    item.inventoryId?.toString() === itemId
                );
            }

            return (
                item.itemType === "build" &&
                item.buildId?.toString() === itemId
            );
        });

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Cart item not found",
            });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.inventoryId")
            .populate({
                path: "items.buildId",
                populate: {
                    path: "components.inventoryId",
                },
            });

        res.json(updatedCart);
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({
            message: "Failed to update cart",
        });
    }
});

// DELETE /api/cart/:itemId
router.delete("/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        const { itemType } = req.query;

        if (!["inventory", "build"].includes(itemType)) {
            return res.status(400).json({
                message: "Invalid item type",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                message: "Invalid item ID",
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter((item) => {
            if (itemType === "inventory") {
                return !(
                    item.itemType === "inventory" &&
                    item.inventoryId?.toString() === itemId
                );
            }

            return !(
                item.itemType === "build" &&
                item.buildId?.toString() === itemId
            );
        });

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.inventoryId")
            .populate({
                path: "items.buildId",
                populate: {
                    path: "components.inventoryId",
                },
            });

        res.json(updatedCart);
    } catch (error) {
        console.error("Remove cart item error:", error);
        res.status(500).json({
            message: "Failed to remove item from cart",
        });
    }
});

// DELETE /api/cart
router.delete("/", async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            return res.json({
                userId: req.user.userId,
                items: [],
            });
        }

        cart.items = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            message: "Failed to clear cart",
        });
    }
});

export default router;