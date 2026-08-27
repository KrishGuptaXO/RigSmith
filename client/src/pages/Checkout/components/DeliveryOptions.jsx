import { useState } from "react";
import { Truck, Package, MapPin, ChevronDown, ChevronUp, Plus } from "lucide-react";
import AuthInput from "../../../components/common/AuthInput";

const deliveryChoices = [
    {
        id: "pickup",
        icon: Package,
        label: "Pickup by yourself",
        desc: "We'll contact you when your build is ready for pickup at our facility.",
        eta: "Ready in 5–7 business days",
    },
    {
        id: "delivery",
        icon: Truck,
        label: "Add delivery address",
        desc: "We'll ship your build to your address with full insurance coverage.",
        eta: "Estimated delivery: 7–10 business days",
    },
];

export default function DeliveryOptions() {
    const [selected, setSelected] = useState("pickup");
    const [address, setAddress] = useState({
        name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
    });

    const handleChange = (field) => (e) =>
        setAddress((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="rounded-2xl border border-[#1e1e2e] bg-[#0f0f18] overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="px-6 py-5 border-b border-[#1e1e2e]">
                <h2 className="text-white font-bold text-xl">Delivery Options</h2>
                <p className="text-gray-500 text-xs mt-1">Choose how you'd like to receive your build.</p>
            </div>

            {/* Radio Options */}
            <div className="divide-y divide-[#1e1e2e]">
                {deliveryChoices.map((choice) => {
                    const Icon = choice.icon;
                    const isSelected = selected === choice.id;
                    return (
                        <button
                            key={choice.id}
                            onClick={() => setSelected(choice.id)}
                            className={`w-full flex items-start gap-4 px-6 py-5 text-left transition-all duration-200 cursor-pointer
                                ${isSelected ? "bg-cyan-400/5" : "hover:bg-[#111118]"}`}
                        >
                            {/* Radio Dot */}
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200
                                ${isSelected ? "border-cyan-400" : "border-gray-600"}`}
                            >
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Icon size={15} className={isSelected ? "text-cyan-400" : "text-gray-500"} />
                                    <span className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-300"}`}>
                                        {choice.label}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs leading-relaxed">{choice.desc}</p>
                                <p className={`text-xs mt-1 font-medium ${isSelected ? "text-cyan-400/80" : "text-gray-600"}`}>
                                    {choice.eta}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Address Form — only when delivery selected */}
            {selected === "delivery" && (
                <div className="border-t border-[#1e1e2e] px-6 py-5 space-y-4 bg-[#0b0b14]">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={15} className="text-cyan-400" />
                        <h3 className="text-white font-semibold text-sm">Delivery Address</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <AuthInput label="Full Name"       value={address.name}    onChange={handleChange("name")}    placeholder="John Doe" />
                        <AuthInput label="Phone"           value={address.phone}   onChange={handleChange("phone")}   placeholder="+91 98765 43210" type="tel" />
                        <AuthInput label="Address Line 1"  value={address.line1}   onChange={handleChange("line1")}   placeholder="House / Flat / Block No." className="sm:col-span-2" />
                        <AuthInput label="Address Line 2"  value={address.line2}   onChange={handleChange("line2")}   placeholder="Street, Locality (Optional)" className="sm:col-span-2" />
                        <AuthInput label="City"            value={address.city}    onChange={handleChange("city")}    placeholder="Mumbai" />
                        <AuthInput label="State"           value={address.state}   onChange={handleChange("state")}   placeholder="Maharashtra" />
                        <AuthInput label="PIN Code"        value={address.pincode} onChange={handleChange("pincode")} placeholder="400001" type="number" />
                    </div>
                </div>
            )}

        </div>
    );
}
