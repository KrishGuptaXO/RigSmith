import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/common/Button";

export default function EmptyWishlist () {
    const navigate = useNavigate();

    return (
        <div className="mt-auto mx-auto flex w-full max-w-7xl flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-[#111827] px-8 py-20 text-center">

            {/* Icon */}
            <div className="rounded-full bg-[#191528] p-5">
                <Heart size={42} className="text-red-400" />
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-2xl font-bold text-white">
                Your wishlist is empty.
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-md text-zinc-400">
                Save your favourite PC builds and they'll appear here for quick access whenever you're ready to purchase.
            </p>

            {/* Button */}
            <Button className="mt-8" onClick={() => navigate("/featured-builds")}>
                Browse Featured Builds
            </Button>
        </div>
    );
}