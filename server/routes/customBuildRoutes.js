import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/import", authMiddleware, async (req, res) => {
    try{
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                message: "PCPartPicker URL is required.",
            });
        }

        console.log("PCPartPicker import requested: ", url);
        console.log("Requested by user: ", req.user.userId);

        return res.status(200).json({
            message: "PCPartPicker URL received successfully.",
            url,
        });
    } catch (error) {
        console.error("Custom build import failed: ", error);

        return res.status(500).json({
            message: "Failed to process custom build import data."
        });
    }
});

export default router;