import { useState } from "react";
import { ShoppingCart, ChevronDown, ChevronUp, Shield, Cpu, Monitor, MemoryStick, CheckCircle } from "lucide-react";
import Card from "../../../../components/common/Card";
import Button from "../../../../components/common/Button";
import useCartStore from "../../../../store/useCartStore";
import toast from "react-hot-toast";

const specIconMap = {
    cpu: Cpu,
    gpu: Monitor,
    ram: MemoryStick,
};

const quickCategories = ["CPU", "GPU", "RAM"];

export default function BuildDetails({ build }) {
    const [expanded, setExpanded] = useState(false);
    const [added, setAdded] = useState(false);

    const addItem = useCartStore((s) => s.addItem);

    const components = build.components || [];
    const specs = build.specs || [];

    const quickComponents = components.filter((component) =>
        quickCategories.includes(component.inventoryId?.category)
    );
    
    const remainingComponents = components.filter((component) => 
        !quickCategories.includes(component.inventoryId?.category)
    );

    const handleAddToCart = async () => {
        try {
            await addItem(build);

            setAdded(true);
            toast.success(`${build.name} added to cart.`);

            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            toast.error(error.message || "Failed to add build to cart.");
        }
    };

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
                <p className="text-4xl font-extrabold tracking-tight text-cyan-400">
                    ₹{build.price.toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-sm text-gray-400">
                    {build.emi}
                </p>
            </div>

            {/* Quick Specs */}
            <div className="mb-2 space-y-2">
                {quickComponents.map((component) => {
                    const inventoryItem = component.inventoryId;
                    const Icon = specIconMap[inventoryItem?.category?.trim().toLowerCase()];

                    return (
                        <div
                            key={inventoryItem._id}
                            className="flex items-center gap-3 border-b border-[#3A2F5B] pb-2"
                        >
                            {Icon && (
                                <Icon
                                    size={15}
                                    className="shrink-0 text-cyan-400"
                                />
                            )}

                            <span className="w-28 shrink-0 text-sm text-gray-400">
                                {inventoryItem.category}
                            </span>

                            <span className="text-right text-sm font-medium leading-snug text-white">
                                {inventoryItem.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Expand / Collapse */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="mb-3 flex w-fit cursor-pointer items-center gap-1 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
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

            {/* Expanded Hardware Components */}
            {expanded && (
                <div className="mb-4 space-y-2">
                    {remainingComponents.map((component) => {
                        const inventoryItem = component.inventoryId;

                        return (
                            <div
                                key={inventoryItem._id}
                                className="flex items-start gap-3 border-b border-[#3A2F5B] pb-2"
                            >
                                <span className="w-28 shrink-0 text-sm text-gray-400">
                                    {inventoryItem.category}
                                </span>

                                <span className="text-sm font-medium leading-snug text-white">
                                    {inventoryItem.name}
                                </span>
                            </div>
                        );
                    })}

                    {/* Build-level specifications */}
                    {specs.map((spec) => (
                        <div
                            key={spec.label}
                            className="flex items-start gap-3 border-b border-[#3A2F5B] pb-2"
                        >
                            <span className="w-28 shrink-0 text-sm text-gray-400">
                                {spec.label}
                            </span>

                            <span className="text-sm font-medium leading-snug text-white">
                                {spec.value}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Warranty Badge */}
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#3A2F5B] bg-[#1a1230] px-4 py-3">
                <Shield
                    size={18}
                    className="shrink-0 text-cyan-400"
                />

                <div>
                    <p className="text-sm font-semibold text-white">
                        {build.warranty?.duration || "Standard"} Warranty
                    </p>

                    <p className="text-xs text-gray-400">
                        {build.warranty?.coverage}
                    </p>
                </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-auto">
                <Button
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center gap-2 py-3 text-base"
                    variant={added ? "secondary" : "primary"}
                >
                    {added ? (
                        <>
                            <CheckCircle size={18} />
                            Added to Cart!
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={18} />
                            Add to Cart
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}