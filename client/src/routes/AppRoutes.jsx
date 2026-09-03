import {Routes, Route} from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoutes from "./ProtectedRoutes";

/* ── Page Imports ─────────────────────────────────────────────── */

// Dashboard
import Dashboard from "../pages/user/Dashboard";

// Builds
import SavedBuilds from "../pages/user/SavedBuilds";
import ViewBuild from "../pages/user/ViewBuild/ViewBuild";
import FeaturedBuilds from "../pages/user/FeaturedBuilds/FeaturedBuilds";

// Inventory
import Inventory from "../pages/user/Inventory/Inventory";

// Orders & Cart
import Orders from "../pages/user/Orders";
import Checkout from "../pages/Checkout/Checkout";

// User
import Settings from "../pages/user/Settings/Settings";
import Wishlist from "../pages/user/Wishlist/Wishlist";

// Auth
import Auth from "../pages/Auth/Auth";


function AppRoutes(){
    return (
        <Routes>

            {/* Public Dashboard */}
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>

                <Route element={<Layout />}>
                    <Route path="/saved-builds" element={<SavedBuilds />} />    {/* User's saved builds (Future Scope) */}
                    <Route path="/orders" element={<Orders />} />               {/* Orders & history */}
                    <Route path="/wishlisted-builds" element={<Wishlist />} />   {/* Wishlist */}
                </Route>

                <Route element={<Layout showSearchBar={false} showGreeting={false} />}>
                    <Route path="/inventory" element={<Inventory />} />         {/* Component inventory */}
                    <Route path="/builds/:id" element={<ViewBuild />} />        {/* Individual build view */}
                    <Route path="/cart" element={<Checkout />} />               {/* Cart / Checkout */}
                    <Route path="/settings" element={<Settings />} />           {/* Account settings */}
                </Route>

            </Route>

            {/* Public */}
            <Route path="/auth" element={<Auth />} />                       {/* Login / Register */}
            <Route path="/featured-builds" element={<FeaturedBuilds />} />  {/* Featured builds showcase */}

        </Routes>
    );
}

export default AppRoutes;