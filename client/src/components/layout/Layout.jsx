import { useState } from "react";
import AppSidebar from "./AppSidebar/AppSidebar"
import Header from "./Header/Header"
import { Outlet } from "react-router-dom";

/*
 *  Layout Props Reference:
 *  ───────────────────────
 *  showSidebar   (default: true)  → Left sidebar navigation
 *  showSearchBar (default: true)  → Search input in the header
 *  showGreeting  (default: true)  → "Good Morning, Krish 👋🏼" greeting
 *
 *  The Navbar (🔔 notification + 🛒 cart) is ALWAYS visible when Layout is used.
 */

export default function Layout({
    showSidebar = true,
    showSearchBar = true,
    showGreeting = true,
}) {
    const [collapsed, setCollapsed] = useState(false);

    // Determine main content margin based on sidebar state
    const contentMargin = !showSidebar
        ? ""
        : collapsed
            ? "ml-20"
            : "ml-64";

    return (
        <div className="flex min-h-screen">

            {showSidebar && (
                <AppSidebar
                    collapsed={collapsed}
                    toggleSidebar={() => setCollapsed(!collapsed)}
                />
            )}

            <div className={`
                flex-1
                flex
                flex-col
                min-w-0
                transition-all
                duration-300
                ${contentMargin}
            `}>
                <Header
                    showSearchBar={showSearchBar}
                    showGreeting={showGreeting}
                />
                <main className="flex-1 overflow-x-hidden p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}