import { Heart } from "lucide-react";
import useWishlistStore from "../../store/wishlistStore";

export default function WishlistButton({build}) {
    const toggleBuild = useWishlistStore(
        (state) => state.toggleBuild
    );

    const isWishlisted = useWishlistStore(
        (state) => state.isWishlisted(build.id)
    );

    return (
        <button onClick={() => toggleBuild(build)} className={"flex h-10 w-10 items-center justify-center rounded-full bg-[#111827]/80 backdrop-blur-md transition-all duration-300 hover:bg-[#191528] hover:scale-110 active:scale-90 cursor-pointer "}>
            <Heart size={20} className={`transition-all duration-300 ${isWishlisted ? "fill-red-500 text-red-500 scale-125" : "text-red-400 hover:scale-110"}`} />
        </button>
    );
}