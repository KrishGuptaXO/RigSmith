import { useState, useRef, useEffect } from "react";
import {
    SlidersHorizontal,
    ChevronDown,
    ChevronUp,
    Check,
} from "lucide-react";

const timeOptions = [
    { id: "7d", label: "Past 7 days" },
    { id: "1m", label: "Past 1 month" },
    { id: "3m", label: "Past 3 months" },
];

const statusOptions = [
    { id: "all", label: "All orders" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
];

export default function FilterDropdown({ filters, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close when clicking outside the dropdown
    useEffect(() => {
        const handler = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    const renderOptions = (options, filterKey) => (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const active = filters[filterKey] === option.id;

                return (
                    <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                            onChange({
                                ...filters,
                                [filterKey]: option.id,
                            })
                        }
                        className={`
                            inline-flex items-center gap-1.5
                            rounded-full border px-3 py-2
                            text-xs font-medium
                            transition-colors duration-150
                            cursor-pointer
                            ${
                                active
                                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                                    : "border-[#2a2a3e] bg-[#11111b] text-gray-400 hover:border-cyan-400/40 hover:text-white"
                            }
                        `}
                    >
                        {option.label}

                        {active && (
                            <Check
                                size={12}
                                className="shrink-0"
                                aria-hidden="true"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className={`
                    flex items-center gap-2
                    rounded-xl border px-4 py-2.5
                    text-sm font-semibold
                    transition-colors duration-200 cursor-pointer
                    ${
                        open
                            ? "border-cyan-400/60 bg-cyan-400/5 text-cyan-400"
                            : "border-[#2a2a3e] bg-[#0f0f18] text-gray-300 hover:border-gray-600 hover:text-white"
                    }
                `}
            >
                <SlidersHorizontal size={14} />
                Filter

                {open ? (
                    <ChevronUp size={13} />
                ) : (
                    <ChevronDown size={13} />
                )}
            </button>

            {open && (
                <div
                    className="
                        absolute right-0 top-full z-50 mt-2
                        w-80 max-w-[calc(100vw-2rem)]
                        rounded-xl border border-[#2a2a3e]
                        bg-[#0d0d16] p-4
                        shadow-2xl shadow-black/50
                    "
                >
                    {/* Time Range */}
                    <section>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                            Time Range
                        </p>

                        {renderOptions(timeOptions, "time")}
                    </section>

                    <div className="my-4 border-t border-[#1e1e2e]" />

                    {/* Order Status */}
                    <section>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                            Order Status
                        </p>

                        {renderOptions(statusOptions, "status")}
                    </section>
                </div>
            )}
        </div>
    );
}
