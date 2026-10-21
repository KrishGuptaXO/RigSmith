import express from "express";
import Supplier from "../../models/supplier.js";
import Inventory from "../../models/Inventory.js";
import { HttpError, escapeRegex, handleError, isValidObjectId } from "../../utils/helper.js";

const router = express.Router();

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSupplier = (body, { partial = false } = {}) => {
    const out = {};
    const errors = [];

    if (!partial || body.name !== undefined) {
        const name = typeof body.name === "string" ? body.name.trim() : "";
        if (!name) errors.push("name is required.");
        else out.name = name;
    }

    for (const key of ["contactName", "phone", "address", "notes"]) {
        if (body[key] !== undefined) {
            if (typeof body[key] !== "string") errors.push(`${key} must be text.`);
            else out[key] = body[key].trim();
        }
    }

    if (body.email !== undefined) {
        const email = typeof body.email === "string" ? body.email.trim() : "";
        if (email && !EMAIL_RX.test(email)) errors.push("email is not valid.");
        else out.email = email;
    }

    if (body.isActive !== undefined) {
        if (typeof body.isActive !== "boolean") errors.push("isActive must be true or false.");
        else out.isActive = body.isActive;
    }

    if (errors.length) throw new HttpError(400, errors.join(" "), errors);
    return out;
};

// GET /api/admin/suppliers?search=  (with how many inventory items each supplies)
router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.search) {
            const rx = new RegExp(escapeRegex(req.query.search), "i");
            filter.$or = [{ name: rx }, { contactName: rx }, { email: rx }];
        }

        const [suppliers, counts] = await Promise.all([
            Supplier.find(filter).sort({ name: 1 }).lean(),
            Inventory.aggregate([
                { $match: { supplierId: { $ne: null } } },
                { $group: { _id: "$supplierId", count: { $sum: 1 } } },
            ]),
        ]);

        const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
        res.status(200).json(
            suppliers.map((s) => ({ ...s, itemCount: countMap.get(String(s._id)) || 0 }))
        );
    } catch (error) {
        handleError(res, error, "Failed to fetch suppliers.");
    }
});

router.post("/", async (req, res) => {
    try {
        const supplier = await Supplier.create(validateSupplier(req.body));
        res.status(201).json(supplier);
    } catch (error) {
        handleError(res, error, "Failed to create supplier.");
    }
});

router.put("/:id", async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid supplier ID.");

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { $set: validateSupplier(req.body, { partial: true }) },
            { new: true, runValidators: true }
        );
        if (!supplier) throw new HttpError(404, "Supplier not found.");

        res.status(200).json(supplier);
    } catch (error) {
        handleError(res, error, "Failed to update supplier.");
    }
});

// Blocked while inventory still references the supplier; deactivate instead.
router.delete("/:id", async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) throw new HttpError(400, "Invalid supplier ID.");

        const inUse = await Inventory.countDocuments({ supplierId: req.params.id });
        if (inUse) {
            throw new HttpError(
                409,
                `Cannot delete: ${inUse} inventory item(s) use this supplier. Reassign them or mark the supplier inactive.`
            );
        }

        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) throw new HttpError(404, "Supplier not found.");

        res.status(200).json({ message: "Supplier deleted.", id: supplier._id });
    } catch (error) {
        handleError(res, error, "Failed to delete supplier.");
    }
});

export default router;