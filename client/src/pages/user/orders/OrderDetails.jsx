import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    MapPin,
    Store,
    Truck,
    CalendarClock,
    LoaderCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import authStore from "../../../store/authStore";
import StatusBadge from "./StatusBadge";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/orders";

function formatDate(dateStr) {
    if (!dateStr) return "—";

    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatPrice(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function InfoRow({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-3">
            <Icon size={15} className="text-gray-500 mt-0.5 shrink-0" />

            <div className="min-w-0">
                <p className="text-gray-500 text-[11px]">
                    {label}
                </p>

                <p className="text-gray-300 text-sm font-medium mt-0.5">
                    {children}
                </p>
            </div>
        </div>
    );
}

const statusSteps = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
];

export default function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = authStore.getState().token;

            if (!token) {
                navigate("/auth");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load order."
                    );
                }

                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);

                toast.error(
                    error.message || "Failed to load order."
                );

                navigate("/orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, navigate]);

    if (loading) {
        return (
            <section className="max-w-5xl mx-auto pb-16">
                <div className="flex items-center justify-center py-32">
                    <LoaderCircle
                        size={28}
                        className="text-cyan-400 animate-spin"
                    />
                </div>
            </section>
        );
    }

    if (!order) return null;

    const isPickup =
        order.shippingAddress?.city === "RigSmith Facility";

    const currentStep = statusSteps.indexOf(order.status);

    return (
        <section className="max-w-5xl mx-auto space-y-6 pb-16">

            {/* Back */}
            <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors cursor-pointer"
            >
                <ArrowLeft size={15} />
                Back to Orders
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-gray-500 text-xs mb-1">
                        Order Details
                    </p>

                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Order #{order.orderNumber}
                    </h1>

                    <p className="text-gray-500 text-xs mt-1">
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>

                <StatusBadge status={order.status} />
            </div>

            {/* Status Timeline */}
            {order.status !== "cancelled" && (
                <div className="rounded-2xl border border-[#1e1e2e] bg-[#0f0f18] p-5">
                    <p className="text-white text-sm font-semibold mb-5">
                        Order Status
                    </p>

                    <div className="flex items-center">
                        {statusSteps.map((step, index) => {
                            const completed = index <= currentStep;

                            return (
                                <div
                                    key={step}
                                    className="flex items-center flex-1 last:flex-none"
                                >
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                                                completed
                                                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                                                    : "border-[#2a2a3e] bg-[#0b0b12] text-gray-600"
                                            }`}
                                        >
                                            <span className="text-[10px] font-bold">
                                                {index + 1}
                                            </span>
                                        </div>

                                        <span
                                            className={`text-[10px] mt-2 capitalize ${
                                                completed
                                                    ? "text-gray-300"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {step}
                                        </span>
                                    </div>

                                    {index < statusSteps.length - 1 && (
                                        <div
                                            className={`h-px flex-1 mx-2 mb-5 ${
                                                index < currentStep
                                                    ? "bg-cyan-400/50"
                                                    : "bg-[#2a2a3e]"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Cancelled */}
            {order.status === "cancelled" && (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
                    <div className="flex items-center gap-2 text-red-400">
                        <Package size={16} />
                        <p className="text-sm font-semibold">
                            This order has been cancelled.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Items */}
                <div className="lg:col-span-2 rounded-2xl border border-[#1e1e2e] bg-[#0f0f18] overflow-hidden">

                    <div className="px-5 py-4 border-b border-[#1e1e2e]">
                        <div className="flex items-center gap-2">
                            <Package
                                size={15}
                                className="text-gray-500"
                            />

                            <h2 className="text-white text-sm font-semibold">
                                Items
                            </h2>
                        </div>
                    </div>

                    <div className="divide-y divide-[#1e1e2e]">
                        {order.items.map((item, index) => (
                            <div
                                key={`${item.itemType}-${index}`}
                                className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-gray-200 text-sm font-medium truncate">
                                        {item.name}
                                    </p>

                                    <p className="text-gray-600 text-xs mt-1">
                                        {formatPrice(item.price)} ×{" "}
                                        {item.quantity}
                                    </p>
                                </div>

                                <p className="text-white text-sm font-semibold shrink-0">
                                    {formatPrice(
                                        item.price * item.quantity
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="px-5 py-4 border-t border-[#1e1e2e] flex items-center justify-between">
                        <span className="text-gray-500 text-sm">
                            Total
                        </span>

                        <span className="text-white text-lg font-bold">
                            {formatPrice(order.totalAmount)}
                        </span>
                    </div>
                </div>

                {/* Delivery */}
                <div className="rounded-2xl border border-[#1e1e2e] bg-[#0f0f18] p-5 h-fit">
                    <h2 className="text-white text-sm font-semibold mb-5">
                        {isPickup
                            ? "Pickup Information"
                            : "Delivery Information"}
                    </h2>

                    <div className="space-y-5">
                        <InfoRow
                            icon={isPickup ? Store : Truck}
                            label="Method"
                        >
                            {isPickup
                                ? "Pickup from RigSmith Facility"
                                : "Home delivery"}
                        </InfoRow>

                        <InfoRow
                            icon={MapPin}
                            label={
                                isPickup
                                    ? "Location"
                                    : "Delivery Address"
                            }
                        >
                            {isPickup
                                ? "RigSmith Facility"
                                : `${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`}
                        </InfoRow>

                        <InfoRow
                            icon={CalendarClock}
                            label="Order placed"
                        >
                            {formatDate(order.createdAt)}
                        </InfoRow>
                    </div>
                </div>
            </div>
        </section>
    );
}