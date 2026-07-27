import { Hammer, Truck, CheckCircle, Package, XCircle } from "lucide-react";

const statusMap = {
    building: {
        label: "Building",
        icon: Hammer,
        pill: "bg-yellow-400/10 text-yellow-400 border-yellow-400/25",
        dot: "bg-yellow-400",
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        pill: "bg-blue-400/10 text-blue-400 border-blue-400/25",
        dot: "bg-blue-400",
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle,
        pill: "bg-cyan-400/10 text-cyan-400 border-cyan-400/25",
        dot: "bg-cyan-400",
    },
    completed: {
        label: "Completed",
        icon: Package,
        pill: "bg-green-400/10 text-green-400 border-green-400/25",
        dot: "bg-green-400",
    },
    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        pill: "bg-red-400/10 text-red-400 border-red-400/25",
        dot: "bg-red-400",
    },
};

export default function StatusBadge({ status }) {
    const cfg = statusMap[status] ?? statusMap.building;
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <Icon size={11} />
            {cfg.label}
        </span>
    );
}
