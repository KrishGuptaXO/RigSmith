import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch, money, formatDate } from "./adminApi";
import { PageHeader, StatCard, StateMessage, Table } from "../../components/admin/AdminUI";
import StatusBadge from "../user/orders/StatusBadge";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        adminFetch("/dashboard").then(setData).catch((e) => setError(e.message));
    }, []);

    if (!data) return <StateMessage loading={!error} error={error} />;

    const { inventory, orders, customers, recentOrders, lowStockItems } = data;

    return (
        <>
            <PageHeader title="Dashboard" subtitle="Live numbers from the database." />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Inventory items" value={inventory.items} hint={`${inventory.units} units in stock`} />
                <StatCard label="Low stock" value={inventory.lowStock} tone="warn" hint={`1–${inventory.lowStockThreshold} units left`} />
                <StatCard label="Out of stock" value={inventory.outOfStock} tone="danger" />
                <StatCard label="Customers" value={customers} />
                <StatCard label="Total orders" value={orders.total} />
                <StatCard label="Pending" value={orders.byStatus.pending || 0} tone="warn" />
                <StatCard label="In progress" value={(orders.byStatus.confirmed || 0) + (orders.byStatus.processing || 0) + (orders.byStatus.shipped || 0)} tone="good" />
                <StatCard label="Delivered" value={orders.byStatus.delivered || 0} />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-white">Recent orders</h2>
                    {recentOrders.length === 0 ? <StateMessage empty emptyText="No orders yet." /> : (
                        <Table columns={["Order", "Customer", "Total", "Status", "Placed"]}>
                            {recentOrders.map((o) => (
                                <tr key={o._id}>
                                    <td className="px-4 py-3"><Link to={`/admin/orders?open=${o._id}`} className="text-cyan-400 hover:underline">{o.orderNumber}</Link></td>
                                    <td className="px-4 py-3">{o.userId?.name || "Deleted user"}</td>
                                    <td className="px-4 py-3">{money(o.totalAmount)}</td>
                                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                                    <td className="px-4 py-3 text-zinc-400">{formatDate(o.createdAt)}</td>
                                </tr>
                            ))}
                        </Table>
                    )}
                </section>

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Needs restocking</h2>
                        <Link to="/admin/inventory?stock=low" className="text-sm text-cyan-400 hover:underline">View all</Link>
                    </div>
                    {lowStockItems.length === 0 ? <StateMessage empty emptyText="Everything is well stocked." /> : (
                        <Table columns={["Item", "Category", "Stock"]}>
                            {lowStockItems.map((i) => (
                                <tr key={i._id}>
                                    <td className="px-4 py-3">{i.name}</td>
                                    <td className="px-4 py-3 text-zinc-400">{i.category}</td>
                                    <td className={`px-4 py-3 font-semibold ${i.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>{i.stock === 0 ? "Out of stock" : i.stock}</td>
                                </tr>
                            ))}
                        </Table>
                    )}
                </section>
            </div>
        </>
    );
}