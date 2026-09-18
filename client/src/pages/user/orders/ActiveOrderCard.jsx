import {
    MapPin,
    Store,
    CalendarClock,
    Truck,
    Package,
    ChevronRight,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

function InfoRow({ icon: Icon, label, value, highlight = false }) {
    if (!value) return null;

    return (
        <div className="flex items-start gap-2 text-xs">
            <Icon
                size={12}
                className={`mt-0.5 shrink-0 ${
                    highlight ? "text-cyan-400" : "text-gray-500"
                }`}
            />

            <span className="text-gray-500">{label}:</span>

            <span
                className={`font-medium ${
                    highlight ? "text-cyan-400" : "text-gray-300"
                }`}
            >
                {value}
            </span>
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

function formatPrice(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

export default function ActiveOrderCard({ order }) {
    const navigate = useNavigate();

    const isDelivery =
        order.shippingAddress?.city !== "RigSmith Facility";

    const itemCount = order.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <div
            onClick={() => navigate(`/orders/${order._id}`)}
            className="rounded-xl border border-[#1e1e2e] bg-[#0f0f18] p-4 transition-all duration-200 hover:border-cyan-400/20 hover:bg-[#111118] group cursor-pointer"
        >

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-white font-bold text-sm">
                        Order #{order.orderNumber}
                    </p>

                    <p className="text-gray-500 text-[11px] mt-0.5">
                        Placed on {formatDate(order.createdAt)}
                        &nbsp;·&nbsp;
                        {itemCount}{" "}
                        {itemCount === 1 ? "item" : "items"}
                    </p>
                </div>

                <StatusBadge status={order.status} />
            </div>

            {/* Items */}
            <div className="mt-4 rounded-xl border border-[#1e1e2e] bg-[#0b0b12] p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Package size={13} className="text-gray-500" />

                    <p className="text-gray-400 text-xs font-semibold">
                        Items
                    </p>
                </div>

                <div className="space-y-1.5">
                    {order.items.map((item, index) => (
                        <div
                            key={`${item.itemType}-${index}`}
                            className="flex items-center justify-between gap-3 text-xs"
                        >
                            <span className="text-gray-300 truncate">
                                {item.name}
                            </span>

                            <span className="text-gray-500 shrink-0">
                                × {item.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Information */}
            <div className="mt-3 space-y-1">

                <InfoRow
                    icon={CalendarClock}
                    label="Placed"
                    value={formatDate(order.createdAt)}
                />

                {isDelivery ? (
                    <>
                        <InfoRow
                            icon={Truck}
                            label="Delivery"
                            value="Home delivery"
                        />

                        <InfoRow
                            icon={MapPin}
                            label="Delivering to"
                            value={`${order.shippingAddress.addressLine}, ${order.shippingAddress.city}`}
                        />
                    </>
                ) : (
                    <InfoRow
                        icon={Store}
                        label="Pickup"
                        value="RigSmith Facility"
                    />
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-[#1e1e2e]">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">
                        Total
                    </span>

                    <ChevronRight
                        size={14}
                        className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-200"
                    />
                </div>

                <span className="text-white font-bold text-sm">
                    {formatPrice(order.totalAmount)}
                </span>
            </div>
        </div>
    );
}