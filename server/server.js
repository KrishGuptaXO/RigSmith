import InventoryRoutes from "./routes/InventoryRoutes.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import buildRoutes from "./routes/buildRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customBuildRoutes from "./routes/customBuildRoutes.js";
import adminRoutes from "./routes/admin/index.js";
import { validateEnv, getAllowedOrigins } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimiters.js";

dotenv.config();

// Refuse to start with a broken configuration instead of failing later at runtime.
const { errors: envErrors, warnings: envWarnings } = validateEnv();
envWarnings.forEach((warning) => console.warn(`Config warning: ${warning}`));
if (envErrors.length > 0) {
    envErrors.forEach((error) => console.error(`Config error: ${error}`));
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = getAllowedOrigins();

// Behind a hosting proxy (Render, Railway...) the real client IP is in X-Forwarded-For.
// Without this every visitor shares the proxy's IP, so rate limits would hit everyone at once.
app.set(
    "trust proxy",
    Number(process.env.TRUST_PROXY_HOPS ?? (process.env.NODE_ENV === "production" ? 1 : 0))
);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
    cors({
        // Requests without an Origin header (curl, server-to-server, health checks) are allowed;
        // browsers must come from CLIENT_URL.
        origin: (origin, callback) =>
            callback(null, !origin || allowedOrigins.includes(origin)),
    })
);
app.use(express.json({ limit: "200kb" }));
app.use("/api", apiLimiter);

// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "RigSmith API is running.",
    });
});

// Health check for hosting platforms
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/inventory", InventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/builds", buildRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/custom-builds", customBuildRoutes);
app.use("/api/admin", adminRoutes);

// Unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

// Last-resort error handler: JSON in, JSON out, never a stack trace.
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON in request body." });
    }

    if (err.type === "entity.too.large") {
        return res.status(413).json({ message: "Request body is too large." });
    }

    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Something went wrong." });
});

// Connect to MongoDB, then start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Rigsmith server running on port ${PORT}`);
    });
};

startServer();