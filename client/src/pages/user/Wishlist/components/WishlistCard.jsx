import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, ShoppingCart } from "lucide-react";
import Card from "../../../../components/common/Card";
import Button from "../../../../components/common/Button";
import useWishlistStore from "../../../../store/wishlistStore";
import useCartStore from "../../../../store/useCartStore";

export default function WishlistCard({ item, itemType }) {
    const navigate = useNavigate();

    const addItem = useCartStore((state) => state.addItem);

    const removeBuild = useWishlistStore(
        (state) => state.removeBuild
    );

    const removeInventory = useWishlistStore(
        (state) => state.removeInventory
    );

    const [loading, setLoading] = useState(false);

    const isBuild = itemType === "build";

    const name = item.name;
    const image = item.image;
    const price = Number(item.price) || 0;

    const handleRemove = async () => {
        try {
            if (isBuild) {
                await removeBuild(item.id);
            } else {
                await removeInventory(item.id);
            }

            toast(`${name} removed from wishlist`, {
                icon: "💔",
            });
        } catch (error) {
            toast.error(
                error.message || "Failed to remove item from wishlist."
            );
        }
    };

    const handleAddToCart = async () => {
        try {
            setLoading(true);

            await addItem(item);

            toast.success(`${name} added to cart`);
        } catch (error) {
            toast.error(
                error.message || "Failed to add item to cart."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="group overflow-hidden">
            {/* Image */}
            <div className="relative group h-64 overflow-hidden rounded-xl">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Details */}
            <div className="mt-4">
                <h3 className="text-xl font-semibold text-white">
                    {name}
                </h3>

                <p className="mt-2 text-lg font-bold text-cyan-400">
                    ₹{price.toLocaleString("en-IN")}
                </p>
            </div>

            {/* Specifications */}
            {isBuild && (
                <div className="mt-5 border-t border-zinc-700 pt-5">
                    <div className="space-y-4">
                        {item.components?.map((component) => {
                            const product = component.inventoryId;

                            if (!product) return null;

                            return (
                                <div key={product._id}>
                                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                                        {product.category}
                                    </p>

                                    <p className="text-sm text-white">
                                        {product.name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {!isBuild && (
                <div className="mt-5 border-t border-zinc-700 pt-5">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                        {item.category}
                    </p>

                    <p className="text-sm text-white">
                        {item.brand}
                    </p>
                </div>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
                {isBuild && (
                    <Button
                        className="flex-1"
                        onClick={() =>
                            navigate(`/builds/${item.id}`)
                        }
                    >
                        View Build →
                    </Button>
                )}

                {!isBuild && (
                    <Button
                        className="flex-1"
                        onClick={() =>
                            navigate(`/inventory`)
                        }
                    >
                        View Product →
                    </Button>
                )}

                <button
                    className="flex items-center justify-center rounded-xl border border-zinc-700 px-4 transition-all hover:border-red-400 hover:text-red-400 cursor-pointer"
                    onClick={handleRemove}
                >
                    <Trash2 size={18} />
                </button>

                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="flex items-center justify-center rounded-xl border border-zinc-700 px-4 transition-all hover:border-cyan-400 hover:text-cyan-400 cursor-pointer disabled:opacity-50"
                >
                    <ShoppingCart size={18} />
                </button>
            </div>
        </Card>
    );
}