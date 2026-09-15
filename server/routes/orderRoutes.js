import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Inventory from "../models/Inventory.js";
import Build from "../models/Build.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order from current cart
router.post("/", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { shippingAddress } = req.body;

        if (
            !shippingAddress?.name ||
            !shippingAddress?.phone ||
            !shippingAddress?.addressLine ||
            !shippingAddress?.city ||
            !shippingAddress?.state ||
            !shippingAddress?.postalCode
        ) {
            return res.status(400).json({
                message: "Complete shipping address is required.",
            });
        }

        session.startTransaction();

        const cart = await Cart.findOne({
            userId: req.user.userId,
        }).session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Your cart is empty.",
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of cart.items) {
            if (cartItem.itemType === "inventory") {
                const inventoryItem = await Inventory.findById(
                    cartItem.inventoryId
                ).session(session);

                if (!inventoryItem) {
                    throw new Error(
                        `Inventory item ${cartItem.inventoryId} no longer exists.`
                    );
                }

                if (inventoryItem.stock < cartItem.quantity) {
                    throw new Error(
                        `${inventoryItem.name} does not have enough stock.`
                    );
                }

                orderItems.push({
                    itemType: "inventory",
                    inventoryId: inventoryItem._id,
                    name: inventoryItem.name,
                    price: inventoryItem.price,
                    quantity: cartItem.quantity,
                    customizations: cartItem.customizations || "",
                });

                totalAmount +=
                    inventoryItem.price * cartItem.quantity;
            }

            if (cartItem.itemType === "build") {
                const build = await Build.findById(
                    cartItem.buildId
                )
                    .populate("components.inventoryId")
                    .session(session);

                if (!build) {
                    throw new Error(
                        `Build ${cartItem.buildId} no longer exists.`
                    );
                }

                for (const component of build.components) {
                    const inventoryItem = component.inventoryId;

                    if (!inventoryItem) {
                        throw new Error(
                            `A component in ${build.name} is no longer available.`
                        );
                    }

                    const requiredStock =
                        component.quantity * cartItem.quantity;

                    if (inventoryItem.stock < requiredStock) {
                        throw new Error(
                            `${inventoryItem.name} does not have enough stock for ${build.name}.`
                        );
                    }
                }

                orderItems.push({
                    itemType: "build",
                    buildId: build._id,
                    name: build.name,
                    price: build.price,
                    quantity: cartItem.quantity,
                    customizations: cartItem.customizations || "",
                });

                totalAmount += build.price * cartItem.quantity;
            }
        }

        // Deduct inventory stock
        for (const cartItem of cart.items) {
            if (cartItem.itemType === "inventory") {
                await Inventory.findByIdAndUpdate(
                    cartItem.inventoryId,
                    {
                        $inc: {
                            stock: -cartItem.quantity,
                        },
                    },
                    { session }
                );
            }

            if (cartItem.itemType === "build") {
                const build = await Build.findById(
                    cartItem.buildId
                ).session(session);

                if (!build) {
                    throw new Error("Build no longer exists.");
                }

                for (const component of build.components) {
                    await Inventory.findByIdAndUpdate(
                        component.inventoryId,
                        {
                            $inc: {
                                stock:
                                    -(
                                        component.quantity *
                                        cartItem.quantity
                                    ),
                            },
                        },
                        { session }
                    );
                }
            }
        }

        const [order] = await Order.create(
            [
                {
                    userId: req.user.userId,
                    items: orderItems,
                    totalAmount,
                    shippingAddress,
                },
            ],
            { session }
        );

        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            message: "Order placed successfully.",
            order,
        });
    } catch (error) {
        await session.abortTransaction();

        console.error("Create order error:", error);

        res.status(400).json({
            message:
                error.message || "Failed to place order.",
        });
    } finally {
        session.endSession();
    }
});

// Get current user's orders
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.userId,
        }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch orders error:", error);

        res.status(500).json({
            message: "Failed to fetch orders.",
        });
    }
});

// Get one order belonging to current user
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Fetch order error:", error);

        res.status(500).json({
            message: "Failed to fetch order.",
        });
    }
});

export default router;