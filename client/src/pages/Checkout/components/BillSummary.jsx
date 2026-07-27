import { Receipt } from "lucide-react";

export default function BillSummary({ total, gst, shipping, grandTotal }) {
    const rows = [
        { label: "Subtotal", value: total, muted: false },
        { label: "GST (18%)", value: gst, muted: true },
        { label: "Shipping", value: shipping, muted: true, hint: shipping === 0 ? "Free on orders above ₹1L" : null },
    ];

    return (
        <div className="mt-4 rounded-xl border border-[#2a2a3e] bg-[#0d0d16] p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
                <Receipt size={15} className="text-gray-400" />
                <span className="text-gray-300 text-sm font-semibold">Bill Summary</span>
            </div>

            {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${row.muted ? "text-gray-500" : "text-gray-300"}`}>
                            {row.label}
                        </span>
                        {row.hint && (
                            <span className="text-[10px] text-cyan-400/70 bg-cyan-400/5 border border-cyan-400/10 px-2 py-0.5 rounded-full">
                                {row.hint}
                            </span>
                        )}
                    </div>
                    <span className={`text-sm font-semibold ${row.muted ? "text-gray-400" : "text-white"}`}>
                        {row.value === 0 && row.hint
                            ? "FREE"
                            : `₹${row.value.toLocaleString("en-IN")}`}
                    </span>
                </div>
            ))}

            {/* Divider + Grand Total */}
            <div className="border-t border-[#2a2a3e] pt-3 flex items-center justify-between">
                <span className="text-white font-bold text-sm">Grand Total</span>
                <span className="text-cyan-400 font-extrabold text-base">
                    ₹{grandTotal.toLocaleString("en-IN")} /-
                </span>
            </div>

            <p className="text-gray-600 text-[11px] mt-1">
                * All prices include applicable taxes. GST invoice will be sent after order confirmation.
            </p>
        </div>
    );
}
