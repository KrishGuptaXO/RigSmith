import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        itemType: {
            type: String,
            enum: ["inventory", "build"],
            required: true,
        },

        inventoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            default: null,
        },

        buildId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Build",
            default: null,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        customizations: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {_id: false}
);

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "An order must contain at least one item.",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        shippingAddress: {
            name: {
                type: String,
                required: true,
                trim: true,
            },

            phone: {
                type: String,
                required: true,
                trim: true,
            },

            addressLine: {
                type: String,
                required: true,
                trim: true,
            },

            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            postalCode: {
                type: String,
                required: true,
                trim: true,
            },
        },
    },
    {timestamps: true}
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;