import { Heart } from "lucide-react";
import useWishlistStore from "../../store/wishlistStore";

export default function WishlistButton({build}) {
    const toggleBuild = useWishlistStore(
        (state) => state.toggleBuild
    );

    const isWishlisted = useWishlistStore(
        (state) => state.isWishlisted
    );

    return (
        <button onClick={() => toggleBuild(build)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827]/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#191528] cursor-pointer">
            <Heart size={20} className={`transition-all duration-300 ${isWishlisted ? "fill-red-300 text-red-400" : "text-zinc-400 hover:text-red-400"}`} />
        </button>
    );
}