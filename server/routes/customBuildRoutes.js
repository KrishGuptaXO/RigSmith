import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { parsePcPartPickerText, PcPartPickerError } from "../services/pcpartpicker/index.js";

const router = express.Router();

/* 
Parses text copied from PCPartPicker's "Copy/Paste Part List" feature
into normalized component data. This does NOT fetch or scrape
PCPartPicker in any way, does NOT persist anything to MongoDB, and does
NOT match components against RigSmith inventory yet — it only returns the
parsed, normalized build so the frontend (or a later step) can decide
what to do with it. 
*/
router.post("/import", authMiddleware, async (req, res) => {
    try{
        const { partList } = req.body;

        if (!partList) {
            return res.status(400).json({
                message: "Pasted PCPartPicker part list text is required.",
            });
        }

        console.log("PCPartPicker text import requested by user: ", req.user.userId);

        const result = parsePcPartPickerText(partList);

        return res.status(200).json(result);
    } catch (error) {
        if (error instanceof PcPartPickerError) {
            console.error("PCPartPicker import failed:", error.message);

            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error("Custom build import failed: ", error);

        return res.status(500).json({
            message: "Failed to process custom build import data."
        });
    }
});

export default router;