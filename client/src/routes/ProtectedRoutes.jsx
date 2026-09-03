import { Navigate, Outlet } from "react-router-dom";
import authStore from "../store/authStore.js";

export default function ProtectedRoutes () {
    const {isAuthenticated} = authStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
}