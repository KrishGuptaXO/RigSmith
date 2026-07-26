import { useState } from "react";
import AppSidebar from "./AppSidebar/AppSidebar"
import Header from "./Header/Header"
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
      <AppSidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
      />

      <div className={`
          flex-1
          flex
          flex-col
          transition-all
          duration-300
          ${collapsed ? "ml-20" : "ml-64"}
        `}
      >
        <Header />
        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}