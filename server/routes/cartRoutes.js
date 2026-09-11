import express from "express";
import Cart from "../models/Cart.js";
import Inventory from "../models/Inventory.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET api/cart
// Get current user's cart
router.get("/", authMiddleware, async (req, res) => {
    try {
        let cart = await Cart.findOne({userId: req.user.userId}).populate("items.inventoryId");

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.userId,
                items: [],
            });
        }

        res.json(cart);
    } catch (error) {
        console.error("Get cart error: ", error);
        res.status(500).json({
            message: "Failed to fetch cart.",
        });
    }
});

// POST /api/cart
// Add an inventory item to cart
router.post("/", authMiddleware, async (req,res) => {
    try {
        const { inventoryId, quantity = 1, customizations = "" } = req.body;

        if (!inventoryId) {
            return res.status(400).json({
                message: "Inventory ID is required.",
            });
        }

        const inventory = await Inventory.findById(inventoryId);

        if (!inventory) {
            return res.status(404).json({
                message: "Inventory item not found."
            });
        }

        let cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            cart = new Cart({
                userId: req.user.userId,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) => item.inventoryId.toString() === inventoryId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                inventoryId,
                quantity,
                customizations,
            });
        }

        await cart.save();
        await cart.populate("items.inventoryId");

        res.status(200).json(cart);
    } catch (error) {
        console.error("Add to cart error: ", error);
        res.status(500).json({
            message: "Failed to add item to cart.",
        });
    }
});

// PATCH /api/cart/:inventoryId
// Update quantity of an item
router.patch("/:inventoryId", authMiddleware, async (req, res) => {
    try {
        const { inventoryId } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Quantity must be a non-negative integer value.",
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found.",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.inventoryId.toString() === inventoryId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart.",
            });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate("items.inventoryId");

        res.json(cart);
    } catch (error) {
        console.error("Update cart error: ", error);
        res.status(500).json({
            message: "Failed to update cart.",
        });
    }
});

// DELETE /api/cart/:inventoryId
// Remove an item from cart
router.delete("/:inventoryId", authMiddleware, async (req, res) => {
    try {
        const { inventoryId } = req.params;

        const cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found.",
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) => item.inventoryId.toString() !== inventoryId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                message: "Item not found in cart.",
            });
        }

        await cart.save();
        await cart.populate("items.inventoryId");

        res.json(cart);
    } catch (error) {
        console.error("Remove from cart error: ", error);
        res.status(500).json({
            message: "Failed to remove item from cart.",
        });
    }
});

// DELETE /api/cart
// Clear current user's cart
router.delete("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user.userId,
        });

        if (!cart) {
            return res.json({
                message: "Cart already empty.",
            });
        }

        cart.items = [];
        await cart.save();

        res.json({
            message: "Cart cleared successfully.",
        });
    } catch (error) {
        console.error("Clear cart errors: ", error);
        res.status(500).json({
            message: "Failed to clear cart.",
        });
    }
});

export default router;