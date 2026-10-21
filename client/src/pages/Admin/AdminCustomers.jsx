import { useState } from "react";
import { money, formatDate } from "./adminApi";
import { PageHeader, StateMessage, Table, Pagination } from "../../components/admin/AdminUI";
import { inputClass, useDebounced, useAdminData } from "../../components/admin/adminShared";

export default function AdminCustomers() {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("customer");
    const [page, setPage] = useState(1);
    const debounced = useDebounced(search);

    const res = useAdminData("/customers", { search: debounced, role, page, limit: 15 });
    const { loading, error } = res;
    const data = res.data || { customers: [], pages: 1, total: 0 };

    return (
        <>
            <PageHeader title="Customers" subtitle={`${data.total} account(s). Read-only: passwords and tokens are never shown.`} />
            <div className="mb-4 flex flex-wrap gap-3">
                <input className={`${inputClass} max-w-sm`} placeholder="Search name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                <select className={`${inputClass} w-auto`} value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
                    <option value="customer">Customers</option>
                    <option value="partner">Partners</option>
                    <option value="admin">Admins</option>
                    <option value="all">All accounts</option>
                </select>
            </div>

            <StateMessage loading={loading && data.customers.length === 0} error={error} empty={!loading && !error && data.customers.length === 0} emptyText="No accounts match." />
            {data.customers.length > 0 && (
                <Table columns={["Name", "Email", "Role", "Orders", "Total spent", "Joined"]}>
                    {data.customers.map((c) => (
                        <tr key={c._id}>
                            <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                            <td className="px-4 py-3">{c.email}</td>
                            <td className="px-4 py-3 capitalize text-zinc-400">{c.role}</td>
                            <td className="px-4 py-3">{c.orderCount}</td>
                            <td className="px-4 py-3">{money(c.totalSpent)}</td>
                            <td className="px-4 py-3 text-zinc-400">{formatDate(c.createdAt)}</td>
                        </tr>
                    ))}
                </Table>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />
            <p className="mt-3 text-xs text-zinc-500">Total spent excludes cancelled orders.</p>
        </>
    );
}