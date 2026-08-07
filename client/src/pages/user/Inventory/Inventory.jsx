import CategoryTabs from "./components/CategoryTabs";
import InventorySearch from "./components/InventorySearch";
import FilterSidebar from "./components/Fliter Sidebar";
import InventoryGrid from "./components/InventoryGrid";
import { useState } from "react";

export default function Inventory() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
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

            {/* Main Layout */}
            <div className="grid grid-cols-12 gap-8">
                <aside className="col-span-3">
                    <FilterSidebar />
                </aside>

                <main className="col-span-9">
                    <InventoryGrid setActiveCategory={activeCategory} />
                </main>
            </div>
        </section>
    );
}