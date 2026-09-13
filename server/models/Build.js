import mongoose from "mongoose";

const buildComponentSchema = new mongoose.Schema(
    {
        inventoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const buildSpecSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const buildSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        components: {
            type: [buildComponentSchema],
            default: [],
        },

        specs: {
            type: [buildSpecSchema],
            default: [],
        },

        emi: {
            type: String,
            default: "",
            trim: true,
        },

        warranty: {
            duration: {
                type: String,
                default: "",
                trim: true,
            },
            coverage: {
                type: String,
                default: "",
                trim: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Build = mongoose.model("Build", buildSchema);

export default Build;