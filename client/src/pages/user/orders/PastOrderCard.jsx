import { CheckCircle, Package, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatDate(dateStr) {
    if (!dateStr) return null;

    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatPrice(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

const conclusionMap = {
    delivered: {
        icon: CheckCircle,
        prefix: "Delivered on",
        color: "text-cyan-400",
    },

    cancelled: {
        icon: XCircle,
        prefix: "Cancelled on",
        color: "text-red-400",
    },
};

export default function PastOrderCard({ order }) {
    const cfg =
        conclusionMap[order.status] ?? conclusionMap.delivered;

    const Icon = cfg.icon;

    const itemCount = order.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#0a0a11] p-4 transition-all duration-200 hover:border-gray-700/50 group">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-gray-300 font-bold text-sm">
                        Order #{order.orderNumber}
                    </p>

                    <p className="text-gray-600 text-[11px] mt-0.5">
                        Placed on {formatDate(order.createdAt)}
                        &nbsp;·&nbsp;
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                    </p>
                </div>

                <StatusBadge status={order.status} />
            </div>

            {/* Items */}
            <div className="mt-4 rounded-xl border border-[#1e1e2e] bg-[#08080e] p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Package size={13} className="text-gray-600" />

                    <p className="text-gray-500 text-xs font-semibold">
                        Items
                    </p>
                </div>

                <div className="space-y-1.5">
                    {order.items.map((item, index) => (
                        <div
                            key={`${item.itemType}-${index}`}
                            className="flex items-center justify-between gap-3 text-xs"
                        >
                            <span className="text-gray-400 truncate">
                                {item.name}
                            </span>

                            <span className="text-gray-600 shrink-0">
                                × {item.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conclusion */}
            <div
                className={`flex items-center gap-1.5 text-xs mt-3 ${cfg.color}`}
            >
                <Icon size={13} />

                <span className="font-semibold">
                    {cfg.prefix}
                </span>

                <span>
                    {formatDate(order.updatedAt) ?? "—"}
                </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-[#1e1e2e]">
                <span className="text-gray-600 text-xs">
                    Total
                </span>

                <span className="text-gray-300 font-bold text-sm">
                    {formatPrice(order.totalAmount)}
                </span>
            </div>
        </div>
    );
}