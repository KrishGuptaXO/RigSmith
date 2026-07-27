import { useState } from "react";
import { CreditCard, Smartphone, Building2, CheckCircle2 } from "lucide-react";

const paymentMethods = [
    {
        id: "debit",
        label: "Debit Card",
        icon: CreditCard,
        desc: "Visa, Mastercard, RuPay",
    },
    {
        id: "credit",
        label: "Credit Card",
        icon: CreditCard,
        desc: "All major cards accepted",
    },
    {
        id: "upi",
        label: "UPI",
        icon: Smartphone,
        desc: "GPay, PhonePe, Paytm, BHIM",
    },
    {
        id: "netbanking",
        label: "Net Banking",
        icon: Building2,
        desc: "All major banks supported",
    },
];

export default function PaymentOptions({ onPay, grandTotal }) {
    const [selected, setSelected] = useState("upi");

    return (
        <div className="border-t border-[#1e1e2e] px-6 py-5 space-y-4 bg-[#0b0b14]">
            <h3 className="text-white font-semibold text-sm mb-3">Choose Payment Method</h3>

            {/* Method Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selected === method.id;
                    return (
                        <button
                            key={method.id}
                            onClick={() => setSelected(method.id)}
                            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all duration-200 cursor-pointer
                                ${isSelected
                                    ? "border-cyan-400 bg-cyan-400/5 text-cyan-400"
                                    : "border-[#2a2a3e] bg-[#0f0f18] text-gray-400 hover:border-gray-600 hover:text-gray-200"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-xs font-semibold leading-tight">{method.label}</span>
                            <span className={`text-[10px] leading-tight ${isSelected ? "text-cyan-400/70" : "text-gray-600"}`}>
                                {method.desc}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Pay CTA */}
            <button
                onClick={onPay}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-400 text-black font-bold text-sm hover:bg-cyan-300 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 mt-2"
            >
                <CheckCircle2 size={18} />
                Pay ₹{grandTotal.toLocaleString("en-IN")} via {paymentMethods.find((m) => m.id === selected)?.label}
            </button>

            <p className="text-gray-600 text-[11px] text-center">
                🔒 Secured by 256-bit SSL encryption. Your payment info is never stored.
            </p>
        </div>
    );
}
