import inventory from "../../../../data/inventoryData";
import InventoryCard from "./InventoryCard";

export default function InventoryGrid ({activeCategory}) {
    const filteredInventory = activeCategory === "All" ? inventory : inventory.filter((product) => product.category && product.category.toLowerCase() === activeCategory.toLowerCase());
    console.log(inventory);
    console.log(filteredInventory);
    return (
        <div className="space-y-5">
            {filteredInventory.map((product) => (
                <InventoryCard key={product.id} product={product} />
            ))}

        </div>
    );
}