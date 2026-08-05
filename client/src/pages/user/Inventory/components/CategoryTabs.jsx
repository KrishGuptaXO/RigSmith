import { useState } from "react";

const categories = [
    "CPU",
    "GPU",
    "Motherboard",
    "RAM",
    "Storage",
    "Case",
    "Cooler",
    "Monitor",
];

export default function CategoryTabs () {
    const [activeCategory, setActiveCategory] = useState("CPU");

    return (
        <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
                <button 
                    key={category} 
                    onClick={() => setActiveCategory(category)} 
                    className={`
                        rounded-full 
                        border 
                        px-5 py-2.5 
                        text-sm font-medium 
                        transition-all duration-300 
                        cursor-pointer 
                        ${activeCategory === category 
                            ? "border-cyan-400 bg-cyan-400 text-black shadow-[0_0_16px_rgba(34,211,238,.35)]" 
                            : "border-zinc-700 bg-[#111827] text-zinc-300 hover:border-cyan-400 hover:text-cyan-400"}
                    `}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}