import authStore from "../../store/authStore";

const API = "http://localhost:5000/api/admin";

// Thin fetch wrapper: adds the JWT, parses JSON, throws Error(message) on non-2xx.
export async function adminFetch(path, { method = "GET", body, params } = {}) {
    const token = authStore.getState().token;
    const query = params
        ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null))
        : "";

    const response = await fetch(`${API}${path}${query}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed.");
    return data;
}

export const money = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n || 0);

export const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";