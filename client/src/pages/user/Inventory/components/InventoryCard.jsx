import Card from "../../../../components/common/Card";
import WishlistButton from "../../../../components/common/WishlistButton";

export default function InventoryCard({ product }) {
    
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

                    <p className="mt-1 text-sm text-green-400">
                        {product.stock}
                    </p>

                    <div className="mt-5 flex gap-3">

                        <button
                            className="
                                mx-2
                                rounded-xl
                                border
                                border-cyan-400
                                p-4
                                text-cyan-400
                                transition-all
                                hover:bg-cyan-400
                                hover:text-black
                                cursor-pointer
                            "
                        >
                            Add to Cart +
                        </button>

                    </div>

                </div>

            </div>

        </Card>
    );
}