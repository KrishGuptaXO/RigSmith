import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, Check } from "lucide-react";

const timeOptions = [
    { id: "7d", label: "Past 7 days" },
    { id: "1m", label: "Past 1 month" },
    { id: "3m", label: "Past 3 months" },
];

const shipOptions = [
    { id: "all", label: "All orders" },
    { id: "shipped", label: "Shipped" },
    { id: "not-shipped", label: "Not Shipped" },
];

export default function FilterDropdown({ filters, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${open
                        ? "border-cyan-400/60 bg-cyan-400/5 text-cyan-400"
                        : "border-[#2a2a3e] bg-[#0f0f18] text-gray-300 hover:border-gray-600 hover:text-white"
                    }`}
            >
                <SlidersHorizontal size={14} />
                Filter
                {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#2a2a3e] bg-[#0d0d16] shadow-2xl shadow-black/50 z-50 overflow-hidden">

                    {/* Time Range */}
                    <div className="px-4 pt-3 pb-2">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Time Range</p>
                        <div className="space-y-1">
                            {timeOptions.map((opt) => {
                                const active = filters.time === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => onChange({ ...filters, time: opt.id })}
                                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 cursor-pointer
                                            ${active ? "bg-cyan-400/10 text-cyan-400" : "text-gray-400 hover:bg-[#161622] hover:text-white"}`}
                                    >
                                        {opt.label}
                                        {active && <Check size={11} className="text-cyan-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-[#1e1e2e] mx-3" />

                    {/* Shipping Status */}
                    <div className="px-4 pt-2 pb-3">
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2">Shipping</p>
                        <div className="space-y-1">
                            {shipOptions.map((opt) => {
                                const active = filters.ship === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => onChange({ ...filters, ship: opt.id })}
                                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 cursor-pointer
                                            ${active ? "bg-cyan-400/10 text-cyan-400" : "text-gray-400 hover:bg-[#161622] hover:text-white"}`}
                                    >
                                        {opt.label}
                                        {active && <Check size={11} className="text-cyan-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
