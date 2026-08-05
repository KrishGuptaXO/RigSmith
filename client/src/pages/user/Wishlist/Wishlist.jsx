import useWishlistStore from "../../../store/wishlistStore";
import WishlistGrid from "./components/WishlistGrid";
import EmptyWishlist from "./components/EmptyWishlist";

export default function Wishlist () {
    const wishlist = useWishlistStore(
        (state) => state.wishlist
    );

    return (
        <section className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Wishlist
                </h1>

                <p className="mt-2 text-zinc-400">
                    Your saved builds for future purchases.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <EmptyWishlist />
            ) : (
                <WishlistGrid />
            )}

        </section>
    );
}