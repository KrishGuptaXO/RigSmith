import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";
import StatusBadge from "../user/orders/StatusBadge";
import { adminFetch, money, formatDate } from "./adminApi";
import { PageHeader, StateMessage, Table, Pagination, SmallButton } from "../../components/admin/AdminUI";
import { inputClass, useDebounced, useAdminData } from "../../components/admin/adminShared";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
    const [params, setParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);
    const [busy, setBusy] = useState(false);
    const debounced = useDebounced(search);

    const res = useAdminData("/orders", { search: debounced, status, page, limit: 15 });
    const { loading, error, reload: load } = res;
    const data = res.data || { orders: [], pages: 1, total: 0, transitions: {} };

    // Deep link from the dashboard: /admin/orders?open=<id>
    const openId = params.get("open");
    useEffect(() => {
        if (!openId) return;
        adminFetch(`/orders/${openId}`).then((r) => setSelected(r.order)).catch((e) => toast.error(e.message));
    }, [openId]);

    const close = () => {
        setSelected(null);
        if (openId) setParams({}, { replace: true });
    };

    const changeStatus = async (next) => {
        const label = next === "cancelled" ? "Cancel this order? Its items will be returned to stock." : `Mark this order as ${next}?`;
        if (!window.confirm(label)) return;

        setBusy(true);
        try {
            const r = await adminFetch(`/orders/${selected._id}/status`, { method: "PATCH", body: { status: next } });
            toast.success(r.message);
            r.warnings?.forEach((w) => toast(w, { icon: "⚠️", duration: 6000 }));
            setSelected({ ...selected, status: r.order.status });
            load();
        } catch (e) {
            toast.error(e.message);
            load();
        } finally {
            setBusy(false);
        }
    };

    const allowed = selected ? data.transitions[selected.status] || [] : [];

    return (
        <>
            <PageHeader title="Orders" subtitle={`${data.total} order(s)`} />
            <div className="mb-4 flex flex-wrap gap-3">
                <input className={`${inputClass} max-w-sm`} placeholder="Search order no., customer name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                <select className={`${inputClass} w-auto capitalize`} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                    <option value="all">All statuses</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <StateMessage loading={loading && data.orders.length === 0} error={error} empty={!loading && !error && data.orders.length === 0} emptyText="No orders match." />
            {data.orders.length > 0 && (
                <Table columns={["Order", "Customer", "Items", "Total", "Status", "Placed", ""]}>
                    {data.orders.map((o) => (
                        <tr key={o._id}>
                            <td className="px-4 py-3 font-medium text-white">{o.orderNumber}</td>
                            <td className="px-4 py-3">{o.userId?.name || "Deleted user"}<p className="text-xs text-zinc-500">{o.userId?.email}</p></td>
                            <td className="px-4 py-3">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                            <td className="px-4 py-3">{money(o.totalAmount)}</td>
                            <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                            <td className="px-4 py-3 text-zinc-400">{formatDate(o.createdAt)}</td>
                            <td className="px-4 py-3 text-right"><SmallButton onClick={() => setSelected(o)}>View</SmallButton></td>
                        </tr>
                    ))}
                </Table>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />

            <Modal open={!!selected} onClose={close}>
                {selected && (
                    <div className="space-y-5 text-sm text-zinc-300">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selected.orderNumber}</h2>
                                <p className="text-zinc-500">Placed {formatDate(selected.createdAt)} · Updated {formatDate(selected.updatedAt)}</p>
                            </div>
                            <StatusBadge status={selected.status} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="mb-1 text-xs uppercase text-zinc-500">Customer</p>
                                <p className="text-white">{selected.userId?.name || "Deleted user"}</p>
                                <p>{selected.userId?.email}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-xs uppercase text-zinc-500">Ship to</p>
                                <p className="text-white">{selected.shippingAddress.name} · {selected.shippingAddress.phone}</p>
                                <p>{selected.shippingAddress.addressLine}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.postalCode}</p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs uppercase text-zinc-500">Items</p>
                            <div className="divide-y divide-[#2E2447] rounded-lg border border-[#3A2F5B]">
                                {selected.items.map((i, idx) => (
                                    <div key={idx} className="flex justify-between gap-3 px-3 py-2">
                                        <div>
                                            <p className="text-white">{i.name} <span className="text-zinc-500">× {i.quantity}</span></p>
                                            <p className="text-xs text-zinc-500 capitalize">{i.itemType}{i.customizations ? ` · ${i.customizations}` : ""}</p>
                                        </div>
                                        <p>{money(i.price * i.quantity)}</p>
                                    </div>
                                ))}
                                <div className="flex justify-between px-3 py-2 font-semibold text-white"><span>Total</span><span>{money(selected.totalAmount)}</span></div>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs uppercase text-zinc-500">Update status</p>
                            {allowed.length === 0 ? (
                                <p className="text-zinc-500">This order is {selected.status}; no further changes are possible.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {allowed.map((s) => (
                                        <SmallButton key={s} tone={s === "cancelled" ? "danger" : "primary"} disabled={busy} onClick={() => changeStatus(s)}>
                                            {s === "cancelled" ? "Cancel order" : `Mark ${s}`}
                                        </SmallButton>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}