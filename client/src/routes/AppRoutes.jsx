import {Routes, Route} from "react-router-dom";
import Dashboard from "../pages/user/Dashboard";
import SavedBuilds from "../pages/user/SavedBuilds";
import Orders from "../pages/user/Orders";
import Settings from "../pages/user/Settings";
import Layout from "../components/layout/Layout";
import ViewBuild from "../pages/user/ViewBuild/ViewBuild";
import Checkout from "../pages/Checkout/Checkout";

function AppRoutes(){
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/saved-builds" element={<SavedBuilds />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/builds/:id" element={<ViewBuild />} />
                <Route path="/cart" element={<Checkout />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;