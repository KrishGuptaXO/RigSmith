import useWishlistStore from "../../../../store/wishlistStore";
import WishlistCard from "./WishlistCard";

export default function WishlistGrid() {
    const buildWishlist = useWishlistStore(
        (state) => state.buildWishlist
    );

    const inventoryWishlist = useWishlistStore(
        (state) => state.inventoryWishlist
    );

    return (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {buildWishlist.map((build) => (
                <WishlistCard
                    key={`build-${build.id}`}
                    item={build}
                    itemType="build"
                />
            ))}

            {inventoryWishlist.map((product) => (
                <WishlistCard
                    key={`inventory-${product.id}`}
                    item={product}
                    itemType="inventory"
                />
            ))}
        </div>
    );
}