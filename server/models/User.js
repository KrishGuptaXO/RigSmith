import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["customer", "partner", "admin"],
            default: "customer",
        },

        buildWishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Build",
            },
        ],

        inventoryWishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;