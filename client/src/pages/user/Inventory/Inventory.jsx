import CategoryTabs from "./components/CategoryTabs";
import InventorySearch from "./components/InventorySearch";
import InventoryGrid from "./components/InventoryGrid";
import { useEffect, useState } from "react";

export default function Inventory() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sort, setSort] = useState("");
    
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInventory = async () => {
            const maxAttempts = 3;
            const retryDelay = 1500;

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    const response = await fetch(
                        "http://localhost:5000/api/inventory"
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch inventory");
                    }

                    const data = await response.json();

                    setInventory(data);
                    setError("");
                    setLoading(false);

                    return;
                } catch (error) {
                    console.error(
                        `Inventory fetch attempt ${attempt} failed:`,
                        error
                    );

                    if (attempt < maxAttempts) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryDelay)
                        );
                    }
                }
            }

            setError(
                "Unable to reach the servers. Please try again later."
            );
            setLoading(false);
        };

        fetchInventory();
    }, []);

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

            {loading ? (
                <div className="flex min-h-80 items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
                        <p className="mt-4 text-sm text-zinc-400">
                            Loading inventory...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex min-h-80 items-center justify-center">
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-8 py-6 text-center">
                        <p className="font-medium text-red-400">
                            Unable to reach the servers.
                        </p>
                        
                        <p className="mt-2 text-sm text-zinc-500">
                            Please try again later.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Categories */}
                    <CategoryTabs
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />

                    {/* Search */}
                    <InventorySearch
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Sort */}
                    {activeCategory !== "All" && (
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-lg border border-zinc-700 bg-[#111827] px-4 py-2 text-sm text-white outline-none"
                        >
                            <option value="">Sort By ↓</option>
                            <option value="low">Price: Low → High</option>
                            <option value="high">Price: High → Low</option>
                        </select>
                    )}

                    {/* Main Layout */}
                    <div className="w-full px-4">
                        <div className="mx-auto max-w-6xl">
                            <InventoryGrid
                                inventory={inventory}
                                activeCategory={activeCategory}
                                search={search}
                                sort={sort}
                            />
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}