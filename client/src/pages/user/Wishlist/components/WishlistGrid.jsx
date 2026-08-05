import useWishlistStore from "../../../../store/wishlistStore";
import WishlistCard from "./WishlistCard";

export default function WishlistGrid () {
    const wishlist = useWishlistStore(
        (state) => state.wishlist
    );

    return (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {wishlist.map((build) => (
                <WishlistCard key={build.id} build={build} />
            ))}

        </div>
    );
}