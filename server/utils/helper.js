import mongoose from "mongoose";

// Low-stock cut-off used by the admin dashboard, inventory filters and reports.
export const LOW_STOCK_THRESHOLD =
    Number.parseInt(process.env.LOW_STOCK_THRESHOLD, 10) || 5;

export const escapeRegex = (value = "") =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const isValidObjectId = (id) =>
    typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

export const parsePagination = (query, defaultLimit = 20, maxLimit = 100) => {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(
        Math.max(Number.parseInt(query.limit, 10) || defaultLimit, 1),
        maxLimit
    );

    return { page, limit, skip: (page - 1) * limit };
};

// Small error type so routes can throw and a single handler maps it to HTTP.
export class HttpError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

export const handleError = (res, error, fallbackMessage) => {
    if (error instanceof HttpError) {
        return res.status(error.statusCode).json({
            message: error.message,
            ...(error.details ? { details: error.details } : {}),
        });
    }

    if (error?.code === 11000) {
        return res.status(409).json({ message: "A record with that value already exists." });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({ message: fallbackMessage });
};