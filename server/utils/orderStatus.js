// Order lifecycle used by the admin portal. Mirrors the enum in models/Order.js.
// Stock is deducted at checkout, so only cancelling needs to touch inventory (restock).

export const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

export const ORDER_TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};

export const canTransition = (from, to) =>
    Boolean(ORDER_TRANSITIONS[from]?.includes(to));