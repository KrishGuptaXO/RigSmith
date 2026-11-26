// Base URL of the RigSmith API.
// Local dev:   leave VITE_API_URL unset -> http://localhost:5000
// Production:  set VITE_API_URL (e.g. https://rigsmith-api.onrender.com) at build time.
export const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");