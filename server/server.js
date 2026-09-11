import InventoryRoutes from "./routes/InventoryRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "RigSmith API is running.",
    });
});

app.use("/api/inventory", InventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// Connect to MongoDB, then start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Rigsmith server running on port ${PORT}`);
    });
};

startServer();