import CategoryTabs from "./components/CategoryTabs";
import InventorySearch from "./components/InventorySearch";
import InventoryGrid from "./components/InventoryGrid";
import { useState } from "react";

export default function Inventory() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sort, setSort] = useState("");

    return (
        <section className="space-y-8">

            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Inventory
                </h1>

                <p className="mt-2 text-zinc-400">
                    Browse every component available in RigSmith.
                </p>
            </div>

            {/* Categories */}
            <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            {/* Search */}
            <InventorySearch value={search} onChange={(e) => setSearch(e.target.value)} />

            {/* Sort */}
            {activeCategory !== "All" && (
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2 text-sm text-white outline-none">
                    <option value="">Sort By ↓</option>
                    <option value="low">Price: Low → High </option>
                    <option value="high">Price: High → Low </option>
                </select>  
            )}
    
            {/* Main Layout */}
            <div className="w-full px-4">
                <div className="mx-auto max-w-6xl">
                    <InventoryGrid activeCategory={activeCategory} search={search} sort={sort} />
                </div>
            </div>
        </section>
    );
}