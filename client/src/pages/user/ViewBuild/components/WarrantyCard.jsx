import { Shield, CheckCircle } from "lucide-react";

const coverageItems = {
    "On-site + Parts Replacement": ["On-site technician visits", "Full parts replacement", "Labor covered"],
    "Premium On-site Support": ["Priority on-site support", "Full parts replacement", "Dedicated support line"],
    "Parts + Labor": ["Parts replacement", "Labor costs covered", "Mail-in service"],
    "Premium Care + Lifetime Technical Support": ["Premium on-site care", "Lifetime tech support", "Full hardware coverage"],
    "Limited Hardware Warranty": ["Hardware defects", "Manufacturing faults"],
};

export default function WarrantyCard({ build }) {
    const warranty = build?.warranty;
    const points = warranty ? (coverageItems[warranty.coverage] || ["Hardware defects covered"]) : ["Hardware defects covered"];

    const durationColors = {
        "5 Years": "text-white-400",
        "3 Years": "text-white-400",
        "1 Year": "text-white-400",
    };
    const durationColor = warranty ? (durationColors[warranty.duration] || "text-cyan-400") : "text-cyan-400";

    return (
        <div className="rounded-xl border border-[#3A2F5B] bg-[#241C38] p-5 mt-5 shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:shadow-cyan-500/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                        <Shield size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base">Warranty</h3>
                        <p className="text-gray-400 text-xs">Included coverage</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`text-2xl font-extrabold ${durationColor}`}>
                        {warranty?.duration ?? "—"}
                    </span>
                </div>
            </div>

            {/* Coverage Type */}
            <div className="rounded-lg bg-[#1a1230] border border-[#3A2F5B] px-4 py-2 mb-4">
                <p className="text-xs text-gray-400">Coverage Type</p>
                <p className="text-white text-sm font-semibold mt-0.5">
                    {warranty?.coverage ?? "Standard Warranty"}
                </p>
            </div>

            {/* Coverage Points */}
            <ul className="space-y-1.5">
                {points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={13} className="text-cyan-400 shrink-0" />
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
}