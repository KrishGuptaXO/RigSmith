import { useState } from "react";
import ProSidebar from "./AppSidebar"
import Header from "./Header"
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen">
      <ProSidebar
      collapsed={collapsed}
      toggleSidebar={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}