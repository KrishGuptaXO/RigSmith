import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { adminFetch } from "./adminApi";
import { PageHeader, StateMessage, Table, SmallButton } from "../../components/admin/AdminUI";
import { inputClass, useAdminData } from "../../components/admin/adminShared";

export default function AdminCategories() {
    const { data, loading, error, reload: load } = useAdminData("/categories");
    const rows = data || [];
    const [editing, setEditing] = useState(null);
    const [newName, setNewName] = useState("");

    const rename = async (from) => {
        try {
            const r = await adminFetch("/categories/rename", { method: "PUT", body: { from, to: newName } });
            toast.success(`Renamed (${r.modified} item${r.modified === 1 ? "" : "s"} updated).`);
            setEditing(null);
            load();
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <>
            <PageHeader
                title="Categories"
                subtitle="Categories come from your inventory items. Add one by creating an item with a new category name."
                actions={<Link to="/admin/inventory" className="text-sm text-cyan-400 hover:underline">Go to inventory →</Link>}
            />
            <StateMessage loading={loading} error={error} empty={!loading && !error && rows.length === 0} emptyText="No categories yet." />
            {rows.length > 0 && (
                <Table columns={["Category", "Items", "Units in stock", ""]}>
                    {rows.map((r) => (
                        <tr key={r.name}>
                            <td className="px-4 py-3">
                                {editing === r.name ? (
                                    <input className={`${inputClass} max-w-xs`} autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} />
                                ) : <span className="font-medium text-white">{r.name}</span>}
                            </td>
                            <td className="px-4 py-3">{r.itemCount}</td>
                            <td className="px-4 py-3">{r.totalStock}</td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    {editing === r.name ? (
                                        <>
                                            <SmallButton tone="primary" onClick={() => rename(r.name)}>Save</SmallButton>
                                            <SmallButton onClick={() => setEditing(null)}>Cancel</SmallButton>
                                        </>
                                    ) : <SmallButton onClick={() => { setEditing(r.name); setNewName(r.name); }}>Rename</SmallButton>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}
        </>
    );
}