import { NavLink, Outlet, Link } from "react-router-dom";
import {
    LayoutDashboard, Cpu, Tags, Truck, Users, ClipboardList, BarChart3, ArrowLeft,
} from "lucide-react";

const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/inventory", label: "Inventory", icon: Cpu },
    { to: "/admin/categories", label: "Categories", icon: Tags },
    { to: "/admin/suppliers", label: "Suppliers", icon: Truck },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
            <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-[#0D1117] shadow-[4px_0_12px_rgba(0,0,0,0.25)]">
                <div className="px-5 py-5">
                    <h1 className="text-2xl font-bold text-white">RigSmith</h1>
                    <p className="text-xs uppercase tracking-widest text-cyan-400">Admin Portal</p>
                </div>

                <nav className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
                    {links.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all ${
                                    isActive ? "bg-[#191528] text-cyan-400" : "text-zinc-400 hover:bg-[#191528] hover:text-cyan-400"
                                }`
                            }
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-[#252B36] p-3">
                    <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-zinc-400 hover:bg-[#191528] hover:text-cyan-400">
                        <ArrowLeft size={18} /> Back to store
                    </Link>
                </div>
            </aside>

            <main className="ml-60 min-w-0 flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}