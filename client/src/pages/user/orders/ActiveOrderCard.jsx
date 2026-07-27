import { MapPin, Store, CalendarClock, Truck, CheckCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

function InfoRow({ icon: Icon, label, value, highlight = false }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2 text-xs">
            <Icon size={12} className={`mt-0.5 shrink-0 ${highlight ? "text-cyan-400" : "text-gray-500"}`} />
            <span className="text-gray-500">{label}:</span>
            <span className={`font-medium ${highlight ? "text-cyan-400" : "text-gray-300"}`}>{value}</span>
        </div>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function ActiveOrderCard({ order }) {
    const isDelivery = order.deliveryType === "delivery";

    return (
        <div className="flex gap-4 rounded-xl border border-[#1e1e2e] bg-[#0f0f18] p-4 transition-all duration-200 hover:border-cyan-400/20 hover:bg-[#111118] group">

            {/* Thumbnail */}
            <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-[#2a2a3e] bg-[#161B22]">
                <img
                    src={order.image}
                    alt={order.buildName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                        <p className="text-white font-bold text-sm leading-snug">{order.buildName}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">Order #{order.id} &nbsp;·&nbsp; {order.price}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {/* Delivery info rows */}
                <div className="space-y-1 pt-1">
                    {isDelivery ? (
                        <>
                            <InfoRow icon={CalendarClock} label="Build ready by" value={formatDate(order.completedBy)} highlight />
                            <InfoRow icon={Truck} label="Ships by" value={formatDate(order.shippedBy)} />
                            <InfoRow icon={MapPin} label="Delivering to" value={order.address} />
                        </>
                    ) : (
                        <>
                            <InfoRow icon={CalendarClock} label="Ready for pickup by" value={formatDate(order.completedBy)} highlight />
                            <InfoRow icon={Store} label="Pickup" value="We'll contact you when ready" />
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
