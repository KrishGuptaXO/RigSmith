import { Navigate, Outlet } from "react-router-dom";
import authStore from "../store/authStore.js";

// UI guard only. The real protection is requireRole("admin") on /api/admin/* in the backend.
export default function AdminRoute() {
    const { isAuthenticated, user } = authStore();

    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    if (user?.role !== "admin") return <Navigate to="/" replace />;

    return <Outlet />;
}