import express from "express";
import mongoose from "mongoose";
import Build from "../models/Build.js";

const router = express.Router();

// Get all builds
router.get("/", async (req, res) => {
    try {
        const builds = await Build.find().populate("components.inventoryId");

        res.status(200).json(builds);
    } catch (error) {
        console.error("Failed to fetch builds:", error.message);
        res.status(500).json({
            message: "Failed to fetch builds.",
        });
    }
});

// Get a single build
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid build ID.",
            });
        }

        const build = await Build.findById(id).populate(
            "components.inventoryId"
        );

        if (!build) {
            return res.status(404).json({
                message: "Build not found.",
            });
        }

        res.status(200).json(build);
    } catch (error) {
        console.error("Failed to fetch build:", error.message);
        res.status(500).json({
            message: "Failed to fetch build.",
        });
    }
});

export default router;