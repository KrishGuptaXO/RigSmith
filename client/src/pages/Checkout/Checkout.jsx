import { useState } from "react";
import { ChevronDown, ChevronUp, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import authStore from "../../store/authStore";
import CartItem from "./components/CartItem";
import BillSummary from "./components/BillSummary";
import PaymentOptions from "./components/PaymentOptions";
import DeliveryOptions from "./components/DeliveryOptions";
import EmptyCart from "./components/EmptyCart";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api/orders";

export default function Checkout() {
    const navigate = useNavigate();
    
    const items = useCartStore((s) => s.items);
    const totalPrice = useCartStore((s) => s.getTotalPrice);
    const clearCart = useCartStore((s) => s.clearCart);

    const [billOpen, setBillOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [delivery, setDelivery] = useState({
        method: "pickup",
        address: {
            name: "",
            phone: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            pincode: "",
        },
    });
    
    const total = totalPrice();
    
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    const gst = Math.round(total * 0.18);
    const shipping = total > 100000 ? 0 : 999;
    const grandTotal = total + gst + shipping;

    const handleDeliveryChange = (data) => {setDelivery(data);};

    const handlePlaceOrder = async () => {
        if (placingOrder) return;

        const token = authStore.getState().token;

        if (!token) {
            toast.error("You must be logged in to place an order.");
            navigate("/auth");
            return;
        }

        if (delivery.method === "delivery") {
            const {
                name,
                phone,
                line1,
                city,
                state,
                pincode,
            } = delivery.address;

            if (
                !name ||
                !phone ||
                !line1 ||
                !city ||
                !state ||
                !pincode
            ) {
                toast.error("Please complete your delivery address.");
                return;
            }
        }

        try {
            setPlacingOrder(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    shippingAddress: {
                        name:
                            delivery.method === "pickup"
                                ? "Pickup"
                                : delivery.address.name,

                        phone:
                            delivery.method === "pickup"
                                ? "N/A"
                                : delivery.address.phone,

                        addressLine:
                            delivery.method === "pickup"
                                ? "Customer Pickup"
                                : [
                                    delivery.address.line1,
                                    delivery.address.line2,
                                ]
                                    .filter(Boolean)
                                    .join(", "),

                        city:
                            delivery.method === "pickup"
                                ? "RigSmith Facility"
                                : delivery.address.city,

                        state:
                            delivery.method === "pickup"
                                ? "N/A"
                                : delivery.address.state,

                        postalCode:
                            delivery.method === "pickup"
                                ? "N/A"
                                : delivery.address.pincode,
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to place order.");
            }

            setOrderId(data.order?._id || null);
            clearCart();
            setOrdered(true);
            setPaymentOpen(false);
            toast.success("Order placed successfully");
        } catch (error) {
            console.error("Place order error: ", error);

            toast.error(error.message || "Failed to place order.");
        } finally {
            setPlacingOrder(false);
        }   
    };

    if (ordered) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                    <CheckCircle
                        size={40}
                        className="text-cyan-400"
                    />
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Order Placed!
                    </h2>

                    <p className="text-gray-400 text-sm">
                        Your order has been successfully placed.
                        We'll contact you shortly.
                    </p>

                    {orderId && (
                        <p className="text-gray-500 text-xs mt-2">
                            Order ID: {orderId}
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/orders")}
                        className="px-6 py-3 rounded-xl border border-zinc-700 text-white font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 cursor-pointer"
                    >
                        View Orders
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all duration-200 cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <section className="space-y-6 pb-16 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-[#161B22] transition-all duration-200 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Proceed to Checkout
                    </h1>

                    <p className="text-gray-400 text-sm mt-0.5">
                        Review your order before placing it.
                    </p>
                </div>
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-[#1e1e2e] bg-[#0f0f18] overflow-hidden shadow-2xl">
                {/* Product Table Header */}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-[#1e1e2e]">
                    <span className="text-white font-semibold text-lg">
                        Product
                    </span>

                    <span className="text-gray-400 font-medium text-sm text-center w-20">
                        Qty
                    </span>

                    <span className="text-gray-400 font-medium text-sm text-right w-28">
                        Price
                    </span>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-[#1e1e2e]">
                    {items.map((item) => (
                        <CartItem
                            key={`${item.itemType}-${item.build.id}`}
                            item={item}
                        />
                    ))}
                </div>

                {/* Totals Row */}
                <div className="border-t border-[#1e1e2e] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">
                            Total
                        </span>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() =>
                                    setBillOpen(!billOpen)
                                }
                                className="text-gray-400 text-xs hover:text-cyan-400 transition-colors cursor-pointer underline underline-offset-2"
                            >
                                {billOpen
                                    ? "Hide Bill Summary"
                                    : "Bill Summary"}
                            </button>

                            <div className="flex items-center gap-4">
                                <span className="text-gray-300 font-semibold text-base">
                                    {totalQty} item
                                    {totalQty !== 1 ? "s" : ""}
                                </span>

                                <span className="text-cyan-400 font-extrabold text-xl">
                                    ₹{total.toLocaleString("en-IN")} /-
                                </span>
                            </div>
                        </div>
                    </div>

                    {billOpen && (
                        <BillSummary
                            total={total}
                            gst={gst}
                            shipping={shipping}
                            grandTotal={grandTotal}
                        />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="border-t border-[#1e1e2e] px-6 py-5 flex flex-wrap items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#3A2F5B] bg-[#1a1230] text-white text-sm font-semibold hover:border-purple-500/60 hover:bg-[#221540] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95"
                    >
                        <CreditCard
                            size={15}
                            className="text-purple-400"
                        />
                        EMI Options
                    </button>

                    <button
                        onClick={() =>
                            setPaymentOpen(!paymentOpen)
                        }
                        disabled={placingOrder}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-bold hover:bg-cyan-300 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                    >
                        Payment Options

                        {paymentOpen ? (
                            <ChevronUp size={15} />
                        ) : (
                            <ChevronDown size={15} />
                        )}
                    </button>
                </div>

                {/* Payment Options */}
                {paymentOpen && (
                    <PaymentOptions
                        onPay={handlePlaceOrder}
                        grandTotal={grandTotal}
                        loading={placingOrder}
                    />
                )}
            </div>

            {/* Delivery Options */}
            <DeliveryOptions
                onChange={handleDeliveryChange}
            />
        </section>
    );
}