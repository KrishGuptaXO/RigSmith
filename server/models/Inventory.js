import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema (
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        brand: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
        },

        specs: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;