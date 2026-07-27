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

const conclusionMap = {
    delivered: {
        icon: CheckCircle,
        prefix: "Delivered on",
        dateKey: "deliveredOn",
        color: "text-cyan-400",
    },
    completed: {
        icon: Package,
        prefix: "Picked up on",
        dateKey: "completedOn",
        color: "text-green-400",
    },
    cancelled: {
        icon: XCircle,
        prefix: "Cancelled on",
        dateKey: "cancelledOn",
        color: "text-red-400",
    },
};

export default function PastOrderCard({ order }) {
    const cfg = conclusionMap[order.status] ?? conclusionMap.delivered;
    const Icon = cfg.icon;
    const conclusionDate = formatDate(order[cfg.dateKey]);

    return (
        <div className="flex gap-4 rounded-xl border border-[#1e1e2e] bg-[#0a0a11] p-4 transition-all duration-200 hover:border-gray-700/50 group">

            {/* Thumbnail */}
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[#2a2a3e] bg-[#161B22] opacity-75 group-hover:opacity-90 transition-opacity duration-200">
                <img
                    src={order.image}
                    alt={order.buildName}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <div>
                        <p className="text-gray-300 font-bold text-sm">{order.buildName}</p>
                        <p className="text-gray-600 text-[11px] mt-0.5">Order #{order.id} &nbsp;·&nbsp; {order.price}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {/* Conclusion line */}
                <div className={`flex items-center gap-1.5 text-xs mt-2 ${cfg.color}`}>
                    <Icon size={13} />
                    <span className="font-semibold">{cfg.prefix}</span>
                    <span>{conclusionDate ?? "—"}</span>
                </div>
            </div>

        </div>
    );
}
