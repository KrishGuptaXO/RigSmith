// Startup configuration checks. Pure functions so they can be unit tested.

export const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];

export const validateEnv = (env = process.env) => {
    const errors = [];
    const warnings = [];

    for (const key of REQUIRED_ENV) {
        if (!env[key]) errors.push(`${key} is not set.`);
    }

    if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
        const message = "JWT_SECRET is shorter than 32 characters. Use a long random value.";
        if (env.NODE_ENV === "production") errors.push(message);
        else warnings.push(message);
    }

    if (env.NODE_ENV === "production" && !env.CLIENT_URL) {
        errors.push("CLIENT_URL is not set (the deployed frontend URL, used for CORS).");
    }

    return { errors, warnings };
};

// CLIENT_URL may hold several comma-separated origins, e.g.
//   https://rigsmith.vercel.app,http://localhost:5173
export const getAllowedOrigins = (env = process.env) =>
    (env.CLIENT_URL || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim().replace(/\/+$/, ""))
        .filter(Boolean);