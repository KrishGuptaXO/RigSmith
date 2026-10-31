import express from "express";
import mongoose from "mongoose";
import Build from "../models/Build.js";

const router = express.Router();

/* Components whose inventory item no longer exists populate to null. Drop them from
responses so the UI never has to deal with holes (re-run `npm run seed:builds` to repair). */
const withoutDanglingComponents = (build) => {
    const doc = build.toObject();
    const before = doc.components.length;
    doc.components = doc.components.filter((component) => component.inventoryId);

    if (doc.components.length !== before) {
        console.warn(
            `Build "${doc.name}" references ${before - doc.components.length} missing inventory item(s). Run: npm run seed:builds`
        );
    }

    return doc;
};

// Get all builds
router.get("/", async (req, res) => {
    try {
        const builds = await Build.find().populate("components.inventoryId");

        res.status(200).json(builds.map(withoutDanglingComponents));
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

        res.status(200).json(withoutDanglingComponents(build));
    } catch (error) {
        console.error("Failed to fetch build:", error.message);
        res.status(500).json({
            message: "Failed to fetch build.",
        });
    }
});

export default router;