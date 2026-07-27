import { useState } from "react";
import { Minus, Plus, Trash2, ChevronDown, ChevronUp, CreditCard, Truck, MapPin, Package, CheckCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CartItem from "./components/CartItem";
import BillSummary from "./components/BillSummary";
import PaymentOptions from "./components/PaymentOptions";
import DeliveryOptions from "./components/DeliveryOptions";
import EmptyCart from "./components/EmptyCart";

export default function Checkout() {
    const navigate = useNavigate();
    const items = useCartStore((s) => s.items);
    const totalPrice = useCartStore((s) => s.totalPrice);
    const clearCart = useCartStore((s) => s.clearCart);

    const [billOpen, setBillOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [ordered, setOrdered] = useState(false);

    const total = totalPrice();
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const gst = Math.round(total * 0.18);
    const shipping = total > 100000 ? 0 : 999;
    const grandTotal = total + gst + shipping;

    if (ordered) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                    <CheckCircle size={40} className="text-cyan-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
                    <p className="text-gray-400 text-sm">Your build is being prepared. We'll contact you shortly.</p>
                </div>
                <button
                    onClick={() => { clearCart(); navigate("/"); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition-all duration-200 cursor-pointer"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <section className="space-y-6 pb-16 max-w-3xl mx-auto">

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
                        Proceed to Checkout 💰
                    </h1>
                    <p className="text-gray-400 text-sm mt-0.5">Review your order before placing it.</p>
                </div>
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-[#1e1e2e] bg-[#0f0f18] overflow-hidden shadow-2xl">

                {/* ── Product Table Header ── */}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-[#1e1e2e]">
                    <span className="text-white font-semibold text-lg">Product</span>
                    <span className="text-gray-400 font-medium text-sm text-center w-20">Qty</span>
                    <span className="text-gray-400 font-medium text-sm text-right w-28">Price</span>
                </div>

                {/* ── Cart Items ── */}
                <div className="divide-y divide-[#1e1e2e]">
                    {items.map((item) => (
                        <CartItem key={item.build.id} item={item} />
                    ))}
                </div>

                {/* ── Totals Row ── */}
                <div className="border-t border-[#1e1e2e] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">Total</span>

                        <div className="flex items-center gap-6">
                            {/* Bill Summary link */}
                            <button
                                onClick={() => setBillOpen(!billOpen)}
                                className="text-gray-400 text-xs hover:text-cyan-400 transition-colors cursor-pointer underline underline-offset-2"
                            >
                                {billOpen ? "Hide Bill Summary" : "Bill Summary"}
                            </button>

                            <div className="flex items-center gap-4">
                                <span className="text-gray-300 font-semibold text-base">
                                    {totalQty} item{totalQty !== 1 ? "s" : ""}
                                </span>
                                <span className="text-cyan-400 font-extrabold text-xl">
                                    ₹{total.toLocaleString("en-IN")} /-
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bill Summary Expandable */}
                    {billOpen && <BillSummary total={total} gst={gst} shipping={shipping} grandTotal={grandTotal} />}
                </div>

                {/* ── Action Buttons ── */}
                <div className="border-t border-[#1e1e2e] px-6 py-5 flex flex-wrap items-center gap-3">
                    {/* EMI Options */}
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#3A2F5B] bg-[#1a1230] text-white text-sm font-semibold hover:border-purple-500/60 hover:bg-[#221540] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95">
                        <CreditCard size={15} className="text-purple-400" />
                        EMI Options
                    </button>

                    {/* Payment Options Toggle */}
                    <button
                        onClick={() => setPaymentOpen(!paymentOpen)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-bold hover:bg-cyan-300 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95"
                    >
                        Payment Options
                        {paymentOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                </div>

                {/* Payment Options Expandable */}
                {paymentOpen && <PaymentOptions onPay={() => setOrdered(true)} grandTotal={grandTotal} />}

            </div>

            {/* ── Delivery Options Card ── */}
            <DeliveryOptions />

        </section>
    );
}
