import { Settings } from "lucide-react";
import inventory from "../../../../data/inventoryData";
import InventoryCard from "./InventoryCard";

export default function InventoryGrid ({activeCategory, search, sort}) {
    const filteredInventory = inventory.filter((product) => {

        // Category Filter
        const matchesCategory = activeCategory === "All" || product.category?.toLowerCase() === activeCategory.toLowerCase();

        // Search Filter
        const searchLower = search.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchLower) || product.brand.toLowerCase().includes(searchLower) || product.specs.some((spec) => spec.toLowerCase().includes(searchLower));

        return matchesCategory && matchesSearch;
    });

    let finalInventory = [...filteredInventory];
    if (sort === "low") {
        finalInventory.sort((a,b) => a.price - b.price);
    }
    if (sort === "high") {
        finalInventory.sort((a,b) => b.price - a.price);
    }

    return (
        <div className="space-y-5">
            {finalInventory.map((product) => (
                <InventoryCard key={product.id} product={product} />
            ))}

        </div>
    );
}