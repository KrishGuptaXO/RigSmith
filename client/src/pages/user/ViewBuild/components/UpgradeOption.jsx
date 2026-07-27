import { ArrowUp, Star, Zap, TrendingUp } from "lucide-react";

const badgeConfig = {
    cyan: {
        text: "text-cyan-300",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/30",
        icon: <Zap size={10} />,
    },
    purple: {
        text: "text-purple-300",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        icon: <Star size={10} />,
    },
    green: {
        text: "text-green-300",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        icon: <TrendingUp size={10} />,
    },
    orange: {
        text: "text-orange-300",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        icon: <Star size={10} />,
    },
};

export default function UpgradeOption({ option }) {
    const badge = option.badge ? (badgeConfig[option.badgeColor] || badgeConfig.cyan) : null;

    return (
        <div className="group flex items-center justify-between gap-4 rounded-xl border border-[#3A2F5B] bg-[#1a1230] px-5 py-4 transition-all duration-200 hover:border-cyan-400/50 hover:bg-[#1f1540] hover:shadow-lg hover:shadow-cyan-500/5 cursor-pointer">
            {/* Left: Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                        {option.category}
                    </span>
                    {badge && option.badge && (
                        <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}
                        >
                            {badge.icon}
                            {option.badge}
                        </span>
                    )}
                </div>
                <p className="text-white font-semibold text-sm leading-snug truncate">
                    {option.name}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed line-clamp-1">
                    {option.description}
                </p>
            </div>

            {/* Right: Price */}
            <div className="text-right shrink-0">
                <p className="text-white font-bold text-sm">{option.price}</p>
                <p className="text-cyan-400 text-xs font-semibold flex items-center gap-0.5 justify-end">
                    <ArrowUp size={10} />
                    {option.priceDelta}
                </p>
            </div>
        </div>
    );
}
