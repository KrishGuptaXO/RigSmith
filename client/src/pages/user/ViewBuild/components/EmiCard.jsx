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
        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 bg-[#241C38] shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#0F141D] mt-5">
                <span className="text-white text-sm font-semibold tracking-wide">
                    EMI plans and Pay Later
                </span>
                <span className="flex items-center gap-1 text-xs text-white/70">
                    <span className="text-white/50 text-[10px] tracking-widest uppercase">powered by</span>
                    <RazorpayLogo />
                </span>
            </div>

            {/* Body */}
            <div className="grid grid-cols-2 divide-x divide-zinc-800 px-1">
                {/* EMI Section */}
                <div className="px-4 py-5">
                    <p className="text-white font-semibold text-sm leading-snug mb-3">
                        EMI plans starting from{" "}
                        <span className="text-cyan-400 font-bold">{emiAmount}/month</span>
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
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-[#1A2230] text-[9px] font-semibold text-zinc-300">
                            +13
                        </span>
                    </div>

                    <button className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-cyan-300">
                        <CreditCard size={12} />
                        View plans
                        <ChevronRight size={12} />
                    </button>
                </div>

                {/* Pay Later Section */}
                <div className="px-4 py-5">
                    <p className="text-white font-semibold text-sm leading-snug mb-3">
                        Pay Later available at{" "}
                        <span className="text-cyan-400 font-bold">0% interest</span>
                    </p>

                    {/* Pay Later icon */}
                    <div className="flex items-center gap-1.5 mb-4">
                        <span className="bg-[#e63c5a] rounded-full w-7 h-7 flex items-center justify-center shadow">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                                <path d="M5 3l14 9-14 9V3z" />
                            </svg>
                        </span>
                    </div>

                    <button className="flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400 px-4 py-2 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-400/10">
                        <Landmark size={12} />
                        View options
                        <ChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}