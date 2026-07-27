import { CreditCard, ChevronRight, Landmark } from "lucide-react";

// Payment partner logos (using SVG text as brand placeholders)
function RazorpayLogo() {
    return (
        <span className="flex items-center gap-1 font-bold text-sm tracking-wide">
            <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
                <path d="M20 80L50 10L80 80L65 80L50 45L35 80Z" fill="white" />
            </svg>
            <span className="text-white font-semibold text-xs tracking-widest">Razorpay</span>
        </span>
    );
}

// Mini partner icon dots
const partnerColors = [
    { bg: "bg-blue-600", label: "Visa" },
    { bg: "bg-red-500", label: "MC" },
    { bg: "bg-yellow-400", label: "UPI" },
];

export default function EmiCard({ build }) {
    const emiAmount = build?.emi?.match(/₹[\d,]+/) ? build.emi.match(/₹[\d,]+/)[0] : "₹3,372";

    return (
        <div className="rounded-xl border border-[#5B1FE8] bg-gradient-to-br from-[#1e0b3b] via-[#2a0f54] to-[#1a0730] shadow-lg shadow-purple-900/30 overflow-hidden mt-5">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#6B21E8]/90">
                <span className="text-white text-sm font-semibold tracking-wide">
                    EMI plans and Pay Later
                </span>
                <span className="flex items-center gap-1 text-xs text-white/70">
                    <span className="text-white/50 text-[10px] tracking-widest uppercase">powered by</span>
                    <RazorpayLogo />
                </span>
            </div>

            {/* Body */}
            <div className="grid grid-cols-2 divide-x divide-[#5B1FE8]/40 px-1">
                {/* EMI Section */}
                <div className="px-4 py-5">
                    <p className="text-white font-semibold text-sm leading-snug mb-3">
                        EMI plans starting from{" "}
                        <span className="text-cyan-300">{emiAmount}/month</span>
                    </p>

                    {/* Partner logos */}
                    <div className="flex items-center gap-1.5 mb-4">
                        {partnerColors.map((p) => (
                            <span
                                key={p.label}
                                className={`${p.bg} rounded-full w-7 h-7 flex items-center justify-center text-white text-[9px] font-bold shadow`}
                            >
                                {p.label}
                            </span>
                        ))}
                        <span className="bg-[#3a1a6e] rounded-full w-7 h-7 flex items-center justify-center text-white text-[9px] font-semibold border border-purple-700">
                            +13
                        </span>
                    </div>

                    <button className="flex items-center gap-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95">
                        <CreditCard size={12} />
                        View plans
                        <ChevronRight size={12} />
                    </button>
                </div>

                {/* Pay Later Section */}
                <div className="px-4 py-5">
                    <p className="text-white font-semibold text-sm leading-snug mb-3">
                        Pay Later available at{" "}
                        <span className="text-cyan-300">0% interest</span>
                    </p>

                    {/* Pay Later icon */}
                    <div className="flex items-center gap-1.5 mb-4">
                        <span className="bg-[#e63c5a] rounded-full w-7 h-7 flex items-center justify-center shadow">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                                <path d="M5 3l14 9-14 9V3z" />
                            </svg>
                        </span>
                    </div>

                    <button className="flex items-center gap-1 border border-[#7C3AED] text-purple-300 hover:bg-[#7C3AED]/20 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95">
                        <Landmark size={12} />
                        View options
                        <ChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}