import rateLimit from "express-rate-limit";

export const createRateLimiter = ({ windowMs, limit, message, ...rest }) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        message: { message },
        ...rest,
    });

// Whole API: generous, just stops a single client hammering the server.
export const apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    message: "Too many requests. Please slow down and try again shortly.",
});

// Login: only FAILED attempts count, so normal users are never blocked.
export const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    message: "Too many failed login attempts. Try again in 15 minutes.",
});

// Register runs Argon2 (64 MB of memory per hash), so keep it tight.
export const registerLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: "Too many accounts created from this network. Try again later.",
});