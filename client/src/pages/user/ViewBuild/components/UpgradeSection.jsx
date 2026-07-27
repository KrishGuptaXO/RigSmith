import { useState } from "react";
import { ChevronDown, ChevronUp, Wrench } from "lucide-react";
import upgradeOptions from "../../../../data/upgradeOptions";
import UpgradeOption from "./UpgradeOption";

export default function UpgradeSection() {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-2">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="group flex items-center gap-2 rounded-xl border border-[#5B1FE8]/60 bg-gradient-to-r from-[#2a0f54]/80 to-[#1a0b38]/80 px-6 py-3 text-white font-semibold text-sm transition-all duration-200 hover:border-[#7C3AED] hover:shadow-lg hover:shadow-purple-900/30 cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
                <Wrench size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                Upgrade your Pre-Built?
                <span className="ml-auto">
                    {open ? (
                        <ChevronUp size={16} className="text-purple-400" />
                    ) : (
                        <ChevronDown size={16} className="text-purple-400" />
                    )}
                </span>
            </button>

            {/* Expandable Upgrade Options */}
            {open && (
                <div className="mt-4 rounded-xl border border-[#3A2F5B] bg-[#241C38] p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Wrench size={16} className="text-purple-400" />
                        <h3 className="text-white font-bold text-base">Available Upgrades</h3>
                        <span className="ml-auto text-xs text-gray-400">
                            {upgradeOptions.length} options
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {upgradeOptions.map((option) => (
                            <UpgradeOption key={option.id} option={option} />
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        Contact our team to customize your build with any of these upgrades.
                    </p>
                </div>
            )}
        </div>
    );
}