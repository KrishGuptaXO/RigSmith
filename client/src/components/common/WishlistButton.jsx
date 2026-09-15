import { Heart } from "lucide-react";
import useWishlistStore from "../../store/wishlistStore";
import toast from "react-hot-toast";

export default function WishlistButton({
    build,
    itemType = "build",
    size = "md",
}) {
    const buildWishlist = useWishlistStore((state) => state.buildWishlist);
    const inventoryWishlist = useWishlistStore(
        (state) => state.inventoryWishlist
    );

    const toggleBuild = useWishlistStore((state) => state.toggleBuild);
    const toggleInventory = useWishlistStore(
        (state) => state.toggleInventory
    );

    const itemId = build._id || build.id;

    const isWishlisted =
        itemType === "build"
            ? buildWishlist.some((item) => item.id === itemId)
            : inventoryWishlist.some((item) => item.id === itemId);

    const sizes = {
        sm: { btn: "h-8 w-8", icon: 16 },
        md: { btn: "h-10 w-10", icon: 20 },
    };

    const currentSize = sizes[size];

    const handleToggle = async () => {
        try {
            if (itemType === "build") {
                await toggleBuild(build);
            } else {
                await toggleInventory(build);
            }

            if (isWishlisted) {
                toast(`${build.name} removed from wishlist`, {
                    icon: "💔",
                });
            } else {
                toast.success(`${build.name} added to wishlist.`);
            }
        } catch (error) {
            toast.error(
                error.message || "Failed to update wishlist."
            );
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`flex ${currentSize.btn} items-center justify-center rounded-full border border-gray-700 bg-[#151515]/80 backdrop-blur-sm transition-all duration-200 hover:scale-105 ${
                isWishlisted
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-400"
            }`}
        >
            <Heart
                size={currentSize.icon}
                className={`transition-all duration-200 ${
                    isWishlisted ? "fill-current scale-110" : ""
                }`}
            />
        </button>
    );
}