import Card from "../../../../components/common/Card";
import WishlistButton from "../../../../components/common/WishlistButton";

export default function BuildImage({ build }) {
    return (
        <Card className="group relative overflow-hidden p-0 aspect-square lg:aspect-auto min-h-85">
            
            {/* Wishlist Button */}
            <div className="absolute right-5 top-5 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <WishlistButton build={build} />
            </div>

            {/* Build Image */}
            <img
                src={build.image}
                alt={build.name}
                className="h-full w-full object-cover rounded-xl"
            />
        </Card>
    );
}