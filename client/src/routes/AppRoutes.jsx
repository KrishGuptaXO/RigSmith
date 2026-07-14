import {Routes, Route, Outlet} from "react-router-dom";
import Dashboard from "../pages/user/Dashboard";
import BuildPC from "../pages/user/BuildPC";
import SavedBuilds from "../pages/user/SavedBuilds";
import Orders from "../pages/user/Orders";
import Settings from "../pages/user/Settings";
import Layout from "../components/layout/Layout";

function AppRoutes(){
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/build" element={<BuildPC />} />
                <Route path="/saved-builds" element={<SavedBuilds />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;