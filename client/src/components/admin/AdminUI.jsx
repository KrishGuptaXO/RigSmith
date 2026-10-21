import { ChevronLeft, ChevronRight } from "lucide-react";

export function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

export function StatCard({ label, value, hint, tone = "default" }) {
    const tones = { default: "text-white", warn: "text-yellow-400", danger: "text-red-400", good: "text-cyan-400" };
    return (
        <div className="rounded-xl border border-[#3A2F5B] bg-[#241C38] p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${tones[tone]}`}>{value}</p>
            {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
        </div>
    );
}

export function StateMessage({ loading, error, empty, emptyText = "Nothing to show yet." }) {
    if (loading) return <p className="py-10 text-center text-zinc-400">Loading…</p>;
    if (error) return <p className="py-10 text-center text-red-400">{error}</p>;
    if (empty) return <p className="py-10 text-center text-zinc-500">{emptyText}</p>;
    return null;
}

export function Table({ columns, children }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[#3A2F5B] bg-[#241C38]">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-[#3A2F5B] text-xs uppercase text-zinc-400">
                    <tr>{columns.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#2E2447] text-zinc-200">{children}</tbody>
            </table>
        </div>
    );
}

export function Pagination({ page, pages, onChange }) {
    if (pages <= 1) return null;
    return (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm text-zinc-400">
            <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg p-2 hover:text-cyan-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"><ChevronLeft size={18} /></button>
            <span>Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-lg p-2 hover:text-cyan-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"><ChevronRight size={18} /></button>
        </div>
    );
}

export function Field({ label, children }) {
    return (
        <label className="block text-sm text-zinc-300">
            <span className="mb-1 block">{label}</span>
            {children}
        </label>
    );
}

export function SmallButton({ children, tone = "default", ...props }) {
    const tones = {
        default: "bg-[#2E2447] text-white hover:bg-[#3A2F5B]",
        primary: "bg-cyan-400 text-black hover:bg-cyan-500",
        danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
    };
    return (
        <button
            {...props}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
        >
            {children}
        </button>
    );
}