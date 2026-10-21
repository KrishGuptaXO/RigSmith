import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";
import { adminFetch, money } from "./adminApi";
import { PageHeader, StateMessage, Table, Pagination, Field, SmallButton } from "../../components/admin/AdminUI";
import { inputClass, useDebounced, useAdminData } from "../../components/admin/adminShared";

const EMPTY = { name: "", brand: "", category: "", image: "", price: "", stock: "", specs: "", supplierId: "" };

function StockBadge({ stock, threshold }) {
    if (stock === 0) return <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-semibold text-red-400">Out of stock</span>;
    if (stock <= threshold) return <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">Low · {stock}</span>;
    return <span className="text-zinc-300">{stock}</span>;
}

export default function AdminInventory() {
    const [params] = useSearchParams();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [stock, setStock] = useState(params.get("stock") || "all");
    const [page, setPage] = useState(1);
    const [form, setForm] = useState(null); // null = closed, {} = editing/creating
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const debounced = useDebounced(search);

    const inv = useAdminData("/inventory", { search: debounced, category, stock, page, limit: 15 });
    const cats = useAdminData("/categories");
    const sups = useAdminData("/suppliers");

    const loading = inv.loading;
    const error = inv.error;
    const data = inv.data || { items: [], pages: 1, total: 0, lowStockThreshold: 5 };
    const categories = cats.data || [];
    const suppliers = sups.data || [];
    const load = inv.reload;

    const openCreate = () => { setEditingId(null); setFormError(""); setForm({ ...EMPTY }); };
    const openEdit = (i) => {
        setEditingId(i._id);
        setFormError("");
        setForm({
            name: i.name, brand: i.brand, category: i.category, image: i.image,
            price: String(i.price), stock: String(i.stock), specs: (i.specs || []).join("\n"),
            supplierId: i.supplierId?._id || "",
        });
    };

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError("");

        // Client-side checks for quick feedback; the server validates again.
        if (!form.name.trim() || !form.brand.trim() || !form.category.trim() || !form.image.trim()) {
            setFormError("Name, brand, category and image are required.");
            setSaving(false);
            return;
        }
        if (form.price === "" || Number(form.price) < 0 || form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
            setFormError("Price must be 0 or more and stock must be a whole number 0 or more.");
            setSaving(false);
            return;
        }

        const body = {
            name: form.name, brand: form.brand, category: form.category, image: form.image,
            price: Number(form.price), stock: Number(form.stock),
            specs: form.specs.split("\n").map((s) => s.trim()).filter(Boolean),
            supplierId: form.supplierId || null,
        };

        try {
            await adminFetch(editingId ? `/inventory/${editingId}` : "/inventory", {
                method: editingId ? "PUT" : "POST",
                body,
            });
            toast.success(editingId ? "Item updated." : "Item created.");
            setForm(null);
            load();
            cats.reload();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const remove = async (item) => {
        if (!window.confirm(`Delete "${item.name}"? This also removes it from carts and wishlists.`)) return;
        try {
            await adminFetch(`/inventory/${item._id}`, { method: "DELETE" });
            toast.success("Item deleted.");
            load();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const quickStock = async (item, adjustBy) => {
        try {
            await adminFetch(`/inventory/${item._id}/stock`, { method: "PATCH", body: { adjustBy } });
            load();
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <PageHeader
                title="Inventory"
                subtitle={`${data.total} item(s)`}
                actions={<SmallButton tone="primary" onClick={openCreate}><Plus size={15} className="mr-1 inline" />Add item</SmallButton>}
            />

            <div className="mb-4 flex flex-wrap gap-3">
                <div className="relative min-w-60 flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input className={`${inputClass} pl-9`} placeholder="Search name, brand or specs…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <select className={`${inputClass} w-auto`} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                    <option value="all">All categories</option>
                    {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <select className={`${inputClass} w-auto`} value={stock} onChange={(e) => { setStock(e.target.value); setPage(1); }}>
                    <option value="all">All stock levels</option>
                    <option value="in">In stock</option>
                    <option value="low">Low stock</option>
                    <option value="out">Out of stock</option>
                </select>
            </div>

            <StateMessage loading={loading && data.items.length === 0} error={error} empty={!loading && !error && data.items.length === 0} emptyText="No inventory matches your filters." />

            {data.items.length > 0 && (
                <Table columns={["Item", "Category", "Supplier", "Price", "Stock", ""]}>
                    {data.items.map((i) => (
                        <tr key={i._id}>
                            <td className="px-4 py-3">
                                <p className="font-medium text-white">{i.name}</p>
                                <p className="text-xs text-zinc-500">{i.brand}</p>
                            </td>
                            <td className="px-4 py-3">{i.category}</td>
                            <td className="px-4 py-3 text-zinc-400">{i.supplierId?.name || "—"}</td>
                            <td className="px-4 py-3">{money(i.price)}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button title="Remove 1" onClick={() => quickStock(i, -1)} disabled={i.stock === 0} className="h-6 w-6 rounded bg-[#2E2447] text-white hover:bg-[#3A2F5B] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">−</button>
                                    <StockBadge stock={i.stock} threshold={data.lowStockThreshold} />
                                    <button title="Add 1" onClick={() => quickStock(i, 1)} className="h-6 w-6 rounded bg-[#2E2447] text-white hover:bg-[#3A2F5B] cursor-pointer">+</button>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <SmallButton onClick={() => openEdit(i)}><Pencil size={14} /></SmallButton>
                                    <SmallButton tone="danger" onClick={() => remove(i)}><Trash2 size={14} /></SmallButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}
            <Pagination page={page} pages={data.pages} onChange={setPage} />

            <Modal open={form !== null} onClose={() => !saving && setForm(null)}>
                {form && (
                    <form onSubmit={save} className="space-y-4">
                        <h2 className="text-xl font-bold text-white">{editingId ? "Edit item" : "Add item"}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Name"><input className={inputClass} value={form.name} onChange={set("name")} /></Field>
                            <Field label="Brand"><input className={inputClass} value={form.brand} onChange={set("brand")} /></Field>
                            <Field label="Category">
                                <input className={inputClass} list="category-options" value={form.category} onChange={set("category")} placeholder="Pick or type a new one" />
                                <datalist id="category-options">{categories.map((c) => <option key={c.name} value={c.name} />)}</datalist>
                            </Field>
                            <Field label="Supplier">
                                <select className={inputClass} value={form.supplierId} onChange={set("supplierId")}>
                                    <option value="">None</option>
                                    {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}{s.isActive ? "" : " (inactive)"}</option>)}
                                </select>
                            </Field>
                            <Field label="Price (₹)"><input type="number" min="0" step="0.01" className={inputClass} value={form.price} onChange={set("price")} /></Field>
                            <Field label="Stock"><input type="number" min="0" step="1" className={inputClass} value={form.stock} onChange={set("stock")} /></Field>
                        </div>
                        <Field label="Image path or URL"><input className={inputClass} value={form.image} onChange={set("image")} placeholder="/images/inventory/example.webp" /></Field>
                        <Field label="Specs (one per line)"><textarea rows={4} className={inputClass} value={form.specs} onChange={set("specs")} /></Field>
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