import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
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
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;