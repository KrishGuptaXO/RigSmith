import { useEffect, useState } from "react";
import { adminFetch, money } from "./adminApi";
import { PageHeader, StatCard, StateMessage, Table, SmallButton } from "../../components/admin/AdminUI";
import { inputClass } from "../../components/admin/adminShared";

export default function AdminReports() {
    const [range, setRange] = useState({ from: "", to: "" });
    const [applied, setApplied] = useState({ from: "", to: "" });
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        adminFetch("/reports", { params: applied }).then((d) => { setData(d); setError(""); }).catch((e) => setError(e.message));
    }, [applied]);

    if (!data) return <StateMessage loading={!error} error={error} />;
    const { orders, inventory, topProducts } = data;

    return (
        <>
            <PageHeader title="Reports" subtitle="Order figures follow the date range; inventory figures are always current." />

            <div className="mb-6 flex flex-wrap items-end gap-3">
                <label className="text-sm text-zinc-300">From<input type="date" className={`${inputClass} mt-1`} value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} /></label>
                <label className="text-sm text-zinc-300">To<input type="date" className={`${inputClass} mt-1`} value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} /></label>
                <SmallButton tone="primary" onClick={() => setApplied(range)}>Apply</SmallButton>
                <SmallButton onClick={() => { setRange({ from: "", to: "" }); setApplied({ from: "", to: "" }); }}>Clear</SmallButton>
            </div>

            <h2 className="mb-3 text-lg font-semibold text-white">Orders</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Orders" value={orders.total} />
                <StatCard label="Placed value" value={money(orders.placedValue)} hint="All non-cancelled orders" tone="good" />
                <StatCard label="Completed sales" value={money(orders.completedSales)} hint={`${orders.completedCount} delivered order(s)`} />
                <StatCard label="Cancelled value" value={money(orders.cancelledValue)} hint={`${orders.cancelledCount} cancelled order(s)`} tone="danger" />
            </div>

            <h2 className="mb-3 mt-8 text-lg font-semibold text-white">Inventory</h2>
            <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Inventory value" value={money(inventory.totalValue)} hint="Selling price × stock" />
                <StatCard label="Low / out of stock" value={inventory.lowStock.length} tone="warn" hint={`${inventory.lowStockThreshold} units or fewer`} />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section>
                    <h3 className="mb-2 font-semibold text-white">Value by category</h3>
                    <Table columns={["Category", "Items", "Units", "Value"]}>
                        {inventory.byCategory.map((c) => (
                            <tr key={c.category}><td className="px-4 py-3">{c.category}</td><td className="px-4 py-3">{c.items}</td><td className="px-4 py-3">{c.units}</td><td className="px-4 py-3">{money(c.value)}</td></tr>
                        ))}
                    </Table>
                </section>

                <section>
                    <h3 className="mb-2 font-semibold text-white">Low-stock products</h3>
                    {inventory.lowStock.length === 0 ? <StateMessage empty emptyText="Nothing is running low." /> : (
                        <Table columns={["Item", "Category", "Stock"]}>
                            {inventory.lowStock.map((i) => (
                                <tr key={i._id}><td className="px-4 py-3">{i.name}</td><td className="px-4 py-3 text-zinc-400">{i.category}</td><td className={`px-4 py-3 font-semibold ${i.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>{i.stock}</td></tr>
                            ))}
                        </Table>
                    )}
                </section>
            </div>

            <section className="mt-6">
                <h3 className="mb-2 font-semibold text-white">Top selling components</h3>
                {topProducts.length === 0 ? <StateMessage empty emptyText="No component sales in this range." /> : (
                    <Table columns={["Product", "Units sold", "Revenue"]}>
                        {topProducts.map((p) => (
                            <tr key={p.inventoryId}><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.unitsSold}</td><td className="px-4 py-3">{money(p.revenue)}</td></tr>
                        ))}
                    </Table>
                )}
                <p className="mt-2 text-xs text-zinc-500">Counts individually purchased components in non-cancelled orders. Featured builds are not broken down.</p>
            </section>
        </>
    );
}