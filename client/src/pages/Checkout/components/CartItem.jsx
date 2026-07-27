import { Minus, Plus, Trash2 } from "lucide-react";
import useCartStore from "../../../store/useCartStore";

export default function CartItem({ item }) {
    const { build, quantity, customizations } = item;
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeItem = useCartStore((s) => s.removeItem);

    const rawPrice = build.price?.replace(/[₹,]/g, "") ?? "0";
    const lineTotal = parseFloat(rawPrice) * quantity;

    return (
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-5">

            {/* Product Info */}
            <div className="flex items-center gap-4 min-w-0">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#2a2a3e] shrink-0 bg-[#161B22]">
                    <img
                        src={build.image}
                        alt={build.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Name + Customizations */}
                <div className="min-w-0">
                    <p className="text-white font-semibold text-sm leading-snug truncate">
                        {build.name}
                    </p>
                    {customizations ? (
                        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed line-clamp-2">
                            {customizations}
                        </p>
                    ) : (
                        <p className="text-gray-600 text-xs mt-0.5 italic">
                            No customizations
                        </p>
                    )}
                    <p className="text-gray-500 text-[11px] mt-1">
                        {build.price} / unit
                    </p>
                </div>
            </div>

            {/* Qty Controls */}
            <div className="flex items-center gap-2 w-24 justify-center">
                <button
                    onClick={() => updateQuantity(build.id, -1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#3A2F5B] text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-200 cursor-pointer"
                >
                    <Minus size={12} />
                </button>
                <span className="text-white font-bold text-sm w-4 text-center">
                    {quantity}
                </span>
                <button
                    onClick={() => updateQuantity(build.id, +1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#3A2F5B] text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-200 cursor-pointer"
                >
                    <Plus size={12} />
                </button>
            </div>

            {/* Price + Remove */}
            <div className="text-right w-28">
                <p className="text-white font-bold text-sm">
                    ₹{lineTotal.toLocaleString("en-IN")} /-
                </p>
                <button
                    onClick={() => removeItem(build.id)}
                    className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-600 hover:text-red-400 transition-colors duration-200 cursor-pointer ml-auto"
                >
                    <Trash2 size={11} />
                    Remove
                </button>
            </div>

        </div>
    );
}
