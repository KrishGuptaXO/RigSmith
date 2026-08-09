import { Heart } from "lucide-react";
import useWishlistStore from "../../store/wishlistStore";

export default function WishlistButton({build, size="md"}) {
    const toggleBuild = useWishlistStore(
        (state) => state.toggleBuild
    );

    const isWishlisted = useWishlistStore(
        (state) => state.isWishlisted(build.id)
    );

    const sizes = {
        sm: {
            btn: "h-8 w-8",
            icon: 16,
        },
        md: {
            btn: "h-10 w-10",
            icon: 20,
        }
    };

    const currentSize = sizes[size];

    return (
        <button 
            onClick={() => toggleBuild(build)} 
            className={`flex ${currentSize.btn} items-center justify-center rounded-full bg-[#111827]/80 backdrop-blur-sm transition-all duration-300 hover:bg-[#191528] hover:scale-110 active:scale-90 cursor-pointer ${
                isWishlisted
                    ? "bg-red-500/20"
                    : "bg-[#111827]/80 hover:bg-[#191528]"
            }`}
        >
            <Heart 
            size={currentSize.icon} 
            className={`transition-all duration-300 
                ${isWishlisted 
                    ? "fill-red-400 text-red-400 scale-110" 
                    : "text-zinc-400 hover:text-red-400 hover:scale-110"}`} 
            />
        </button>
    );
}