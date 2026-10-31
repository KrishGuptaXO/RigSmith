import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Inventory from "../models/Inventory.js";
import Build from "../models/Build.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { HttpError, handleError } from "../utils/helper.js";

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
            throw new HttpError(400, "Complete shipping address is required.");
        }

        let order;

        // withTransaction retries the callback on transient errors (e.g. a write
        // conflict with another checkout), so everything inside must be re-runnable.
        await session.withTransaction(async () => {
            const cart = await Cart.findOne({
                userId: req.user.userId,
            }).session(session);

            if (!cart || cart.items.length === 0) {
                throw new HttpError(400, "Your cart is empty.");
            }

            const orderItems = [];
            let totalAmount = 0;

            // inventoryId -> { name, stock (as read), needed (summed over the WHOLE cart) }
            // The same part can appear in several cart lines (two builds sharing a GPU,
            // or a build plus the same part on its own), so stock is checked against the
            // combined total, not line by line.
            const demand = new Map();
            const addDemand = (inventoryId, name, stock, quantity) => {
                const key = String(inventoryId);
                const entry = demand.get(key) || { inventoryId, name, stock, needed: 0 };
                entry.needed += quantity;
                demand.set(key, entry);
            };

            for (const cartItem of cart.items) {
                if (!Number.isInteger(cartItem.quantity) || cartItem.quantity < 1) {
                    throw new HttpError(400, "Cart contains an invalid quantity.");
                }

                if (cartItem.itemType === "inventory") {
                    const inventoryItem = await Inventory.findById(
                        cartItem.inventoryId
                    ).session(session);

                    if (!inventoryItem) {
                        throw new HttpError(
                            400,
                            `Inventory item ${cartItem.inventoryId} no longer exists.`
                        );
                    }

                    if (inventoryItem.stock < cartItem.quantity) {
                        throw new HttpError(
                            400,
                            `${inventoryItem.name} does not have enough stock.`
                        );
                    }

                    addDemand(
                        inventoryItem._id,
                        inventoryItem.name,
                        inventoryItem.stock,
                        cartItem.quantity
                    );

                    orderItems.push({
                        itemType: "inventory",
                        inventoryId: inventoryItem._id,
                        name: inventoryItem.name,
                        price: inventoryItem.price,
                        quantity: cartItem.quantity,
                        customizations: cartItem.customizations || "",
                    });

                    totalAmount += inventoryItem.price * cartItem.quantity;
                }

                if (cartItem.itemType === "build") {
                    // Pre-built systems are ready-made units that are already sold as a
                    // product: their parts are not separate stock lines. So checkout only
                    // needs the build itself and never validates or deducts component stock.

                    const build = await Build.findById(cartItem.buildId).session(session);
                    if (!build) {
                        throw new HttpError(
                            400,
                            `Build ${cartItem.buildId} no longer exists.`
                        );
                    }

                    orderItems.push({
                        itemType: "build",
                        buildId: build._id,
                        name: build.name,
                        price: build.price,
                        quantity: cartItem.quantity,
                        customizations: cartItem.customizations || "",
                        
                        // An EMPTY array means "no component stock was deducted for this
                        // order", so cancelling must not restock anything. (A missing field
                        // is a legacy order and takes the legacy path in restockOrder.)
                        components: [],
                    });

                    totalAmount += build.price * cartItem.quantity;
                }
            }

            // Cheap early check on the combined demand, before any write.
            for (const entry of demand.values()) {
                if (entry.needed > entry.stock) {
                    throw new HttpError(
                        400,
                        `${entry.name} does not have enough stock for everything in your cart.`
                    );
                }
            }

            // Deduct once per part, using the combined demand. The `stock >= needed`
            // filter makes the check and the decrement a single atomic step, so stock can
            // never go negative even if another checkout or an admin edit lands in between.
            for (const entry of demand.values()) {
                const result = await Inventory.updateOne(
                    { _id: entry.inventoryId, stock: { $gte: entry.needed } },
                    { $inc: { stock: -entry.needed } },
                    { session }
                );

                if (!result.matchedCount) {
                    throw new HttpError(
                        400,
                        `${entry.name} does not have enough stock for everything in your cart.`
                    );
                }
            }

            [order] = await Order.create(
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
        });

        res.status(201).json({
            message: "Order placed successfully.",
            order,
        });
    } catch (error) {
        handleError(res, error, "Failed to place order.");
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