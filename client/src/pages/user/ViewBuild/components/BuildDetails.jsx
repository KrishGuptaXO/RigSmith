import { useState } from "react";
import { ShoppingCart, ChevronDown, ChevronUp, Shield, Cpu, Monitor, MemoryStick } from "lucide-react";
import Card from "../../../../components/common/Card";
import Button from "../../../../components/common/Button";

const specIconMap = {
    "Processor": Cpu,
    "Graphics Card": Monitor,
    "Memory": MemoryStick,
};

export default function BuildDetails({ build }) {
    const [expanded, setExpanded] = useState(false);

    const quickSpecs = build.specs.filter((s) =>
        ["Processor", "Graphics Card", "Memory"].includes(s.label)
    );

    const remainingSpecs = build.specs.filter((s) =>
        !["Processor", "Graphics Card", "Memory"].includes(s.label)
    );

    return (
        <Card className="flex h-full flex-col gap-0 p-6">
            
            {/* Build Name */}
            <div className="mb-3">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    {build.name}
                </h2>
            </div>

            {/* Price */}
            <div className="mb-5">
                <p className="text-4xl font-extrabold text-cyan-400 tracking-tight">
                    {build.price}
                </p>
                <p className="text-sm text-gray-400 mt-1">{build.emi}</p>
            </div>

            {/* Quick Specs */}
            <div className="space-y-2 mb-2">
                {quickSpecs.map((spec) => {
                    const Icon = specIconMap[spec.label];
                    return (
                        <div
                            key={spec.label}
                            className="flex items-center gap-3 border-b border-[#3A2F5B] pb-2"
                        >
                            {Icon && (
                                <Icon
                                    size={15}
                                    className="text-cyan-400 shrink-0"
                                />
                            )}
                            <span className="text-gray-400 text-sm w-28 shrink-0">
                                {spec.label}
                            </span>
                            <span className="font-medium text-sm text-right text-white leading-snug">
                                {spec.value}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Expand / Collapse More Specs */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors cursor-pointer mb-3 w-fit"
            >
                {expanded ? (
                    <>
                        <ChevronUp size={14} />
                        Show less
                    </>
                ) : (
                    <>
                        <ChevronDown size={14} />
                        Expand to see more details…
                    </>
                )}
            </button>

            {/* Expanded Specs */}
            {expanded && (
                <div className="space-y-2 mb-4 animate-pulse-once">
                    {remainingSpecs.map((spec) => (
                        <div
                            key={spec.label}
                            className="flex items-start gap-3 border-b border-[#3A2F5B] pb-2"
                        >
                            <span className="text-gray-400 text-sm w-28 shrink-0">
                                {spec.label}
                            </span>
                            <span className="font-medium text-sm text-white leading-snug">
                                {spec.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Warranty Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-[#1a1230] border border-[#3A2F5B] px-4 py-3 mb-4">
                <Shield size={18} className="text-cyan-400 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-white">
                        {build.warranty.duration} Warranty
                    </p>
                    <p className="text-xs text-gray-400">{build.warranty.coverage}</p>
                </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-auto">
                <Button className="w-full flex items-center justify-center gap-2 text-base py-3">
                    <ShoppingCart size={18} />
                    Add to Cart
                </Button>
            </div>
        </Card>
    );
}