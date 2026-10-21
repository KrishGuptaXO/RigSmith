import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";
import { adminFetch } from "./adminApi";
import { PageHeader, StateMessage, Table, Field, SmallButton } from "../../components/admin/AdminUI";
import { inputClass, useDebounced, useAdminData } from "../../components/admin/adminShared";

const EMPTY = { name: "", contactName: "", email: "", phone: "", address: "", notes: "", isActive: true };

export default function AdminSuppliers() {
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const debounced = useDebounced(search);

    const { data, loading, error, reload: load } = useAdminData("/suppliers", { search: debounced });
    const rows = data || [];

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const openForm = (s) => {
        setEditingId(s?._id || null);
        setFormError("");
        setForm(s ? { ...EMPTY, ...s } : { ...EMPTY });
    };

    const save = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return setFormError("Supplier name is required.");
        setSaving(true);
        setFormError("");
        const { name, contactName, email, phone, address, notes, isActive } = form;
        try {
            await adminFetch(editingId ? `/suppliers/${editingId}` : "/suppliers", {
                method: editingId ? "PUT" : "POST",
                body: { name, contactName, email, phone, address, notes, isActive },
            });
            toast.success(editingId ? "Supplier updated." : "Supplier added.");
            setForm(null);
            load();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const remove = async (s) => {
        if (!window.confirm(`Delete supplier "${s.name}"?`)) return;
        try {
            await adminFetch(`/suppliers/${s._id}`, { method: "DELETE" });
            toast.success("Supplier deleted.");
            load();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <PageHeader
                title="Suppliers"
                actions={<SmallButton tone="primary" onClick={() => openForm(null)}><Plus size={15} className="mr-1 inline" />Add supplier</SmallButton>}
            />
            <input className={`${inputClass} mb-4 max-w-sm`} placeholder="Search suppliers…" value={search} onChange={(e) => setSearch(e.target.value)} />

            <StateMessage loading={loading} error={error} empty={!loading && !error && rows.length === 0} emptyText="No suppliers yet." />
            {rows.length > 0 && (
                <Table columns={["Supplier", "Contact", "Items supplied", "Status", ""]}>
                    {rows.map((s) => (
                        <tr key={s._id}>
                            <td className="px-4 py-3 font-medium text-white">{s.name}</td>
                            <td className="px-4 py-3 text-zinc-400">{[s.contactName, s.email, s.phone].filter(Boolean).join(" · ") || "—"}</td>
                            <td className="px-4 py-3">{s.itemCount}</td>
                            <td className="px-4 py-3">{s.isActive ? <span className="text-cyan-400">Active</span> : <span className="text-zinc-500">Inactive</span>}</td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <SmallButton onClick={() => openForm(s)}><Pencil size={14} /></SmallButton>
                                    <SmallButton tone="danger" onClick={() => remove(s)}><Trash2 size={14} /></SmallButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}

            <Modal open={form !== null} onClose={() => !saving && setForm(null)}>
                {form && (
                    <form onSubmit={save} className="space-y-4">
                        <h2 className="text-xl font-bold text-white">{editingId ? "Edit supplier" : "Add supplier"}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Name"><input className={inputClass} value={form.name} onChange={set("name")} /></Field>
                            <Field label="Contact person"><input className={inputClass} value={form.contactName} onChange={set("contactName")} /></Field>
                            <Field label="Email"><input type="email" className={inputClass} value={form.email} onChange={set("email")} /></Field>
                            <Field label="Phone"><input className={inputClass} value={form.phone} onChange={set("phone")} /></Field>
                        </div>
                        <Field label="Address"><input className={inputClass} value={form.address} onChange={set("address")} /></Field>
                        <Field label="Notes"><textarea rows={3} className={inputClass} value={form.notes} onChange={set("notes")} /></Field>
                        <label className="flex items-center gap-2 text-sm text-zinc-300">
                            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                            Active supplier
                        </label>
                        {formError && <p className="text-sm text-red-400">{formError}</p>}
                        <div className="flex justify-end gap-2">
                            <SmallButton type="button" onClick={() => setForm(null)} disabled={saving}>Cancel</SmallButton>
                            <SmallButton type="submit" tone="primary" disabled={saving}>{saving ? "Saving…" : "Save"}</SmallButton>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}