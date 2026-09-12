import Card from "../../../../components/common/Card";
import WishlistButton from "../../../../components/common/WishlistButton";
import toast from "react-hot-toast";
import useCartStore from "../../../../store/useCartStore";
import { useState } from "react";

export default function InventoryCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [loading, setLoading] = useState(false);

    const outOfStock = product.stock <= 0;
    const stockLabel = outOfStock
        ? "Out of Stock"
        : product.stock <= 5
            ? `Low Stock (${product.stock} left)`
            : `In Stock (${product.stock})`;
    const stockColor = outOfStock
        ? "text-red-400"
        : product.stock <= 5
            ? "text-yellow-400"
            : "text-green-400";

    return (
        <Card className="group transition-all duration-300 hover:border-cyan-400">

            <div className="flex items-center gap-6">

                {/* Product Image */}
                <div className="relative">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-28 w-28 rounded-xl object-cover"
                    />

                    <div className="absolute right-2 top-2">
                        <WishlistButton build={product} size="sm" />
                    </div>

                </div>

                {/* Details */}
                <div className="flex-1">

                    <h3 className="text-lg font-semibold text-white">
                        {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-400">
                        {product.brand}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                        {product.specs.map((spec) => (
                            <span
                                key={spec}
                                className="
                                    rounded-full
                                    bg-[#191528]
                                    px-3
                                    py-1
                                    text-xs
                                    text-cyan-400
                                "
                            >
                                {spec}
                            </span>
                        ))}

                    </div>

                </div>

                {/* Price */}
                <div className="text-right">

                    <p className="text-2xl font-bold text-white">
                        {product.price}
                    </p>

                    <p className={`mt-1 text-sm ${stockColor}`}>
                        {stockLabel}
                    </p>

                    <div className="mt-5 flex gap-3">
                        <button
                            disabled={outOfStock}
                            onClick={() => {
                                setLoading(true);
                                addItem(product, "");
                                toast.success(`${product.name} added to cart`);
                                setTimeout(() => setLoading(false), 500);
                            }}
                            className={`
                                mx-2
                                rounded-xl
                                border
                                p-4
                                transition-all
                                ${outOfStock
                                    ? "border-zinc-700 text-zinc-600 cursor-not-allowed opacity-50"
                                    : "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black cursor-pointer"
                                }
                            `}
                        >
                            {outOfStock ? "Sold Out" : "Add to Cart +"}
                        </button>

                    </div>

                </div>

            </div>

        </Card>
    );
}