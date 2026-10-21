import { HttpError } from "./helper.js";

const clean = (v) => (typeof v === "string" ? v.trim() : v);

// Only these fields can ever be written from a request body (no mass assignment).
export const validateInventoryInput = (body, { partial = false } = {}) => {
    const out = {};
    const errors = [];

    const need = (key) => !partial || body[key] !== undefined;

    for (const key of ["name", "brand", "category"]) {
        if (need(key)) {
            const v = clean(body[key]);
            if (typeof v !== "string" || !v) errors.push(`${key} is required.`);
            else if (v.length > 200) errors.push(`${key} is too long.`);
            else out[key] = v;
        }
    }

    if (need("image")) {
        const v = clean(body.image);
        if (typeof v !== "string" || !/^(\/|https?:\/\/)\S+$/.test(v)) {
            errors.push("image must be a path starting with / or an http(s) URL.");
        } else out.image = v;
    }

    if (need("price")) {
        const v = Number(body.price);
        if (body.price === "" || body.price === null || !Number.isFinite(v) || v < 0) {
            errors.push("price must be a number 0 or greater.");
        } else out.price = Math.round(v * 100) / 100;
    }

    if (need("stock")) {
        const v = Number(body.stock);
        if (body.stock === "" || body.stock === null || !Number.isInteger(v) || v < 0) {
            errors.push("stock must be a whole number 0 or greater.");
        } else out.stock = v;
    }

    if (body.specs !== undefined) {
        if (!Array.isArray(body.specs) || body.specs.some((s) => typeof s !== "string")) {
            errors.push("specs must be an array of strings.");
        } else out.specs = body.specs.map((s) => s.trim()).filter(Boolean);
    }

    if (body.supplierId !== undefined) {
        out.supplierId = body.supplierId || null;
    }

    if (errors.length) throw new HttpError(400, errors.join(" "), errors);
    return out;
};