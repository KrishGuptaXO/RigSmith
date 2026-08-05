import {useNavigate} from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";
import Card from "../../../../components/common/Card";
import Button from "../../../../components/common/Button";
import useWishlistStore from "../../../../store/wishlistStore";

export default function WishlistCard ({build}) {
    const navigate = useNavigate();

    const removeBuild = useWishlistStore(
        (state) => state.removeBuild
    );

    const {name, cpu, gpu, ram, price, image} = build;

    return (
        <Card className="group overflow-hidden">
            
            {/* Image */}
            <div className="relative group h-64 overflow-hidden rounded-xl">
                <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />                
            </div>

            {/* Details */}
            <div className="mt-4">
                <h3 className="text-xl font-semibold text-white">
                    {name}
                </h3>

                <p className="mt-2 text-lg font-bold text-cyan-400">
                    {price}
                </p>
            </div>

            {/* Specifications */}
            <div className="mt-5 border-t border-zinc-700 pt-5">
                <div className="space-y-4">
                    
                    <div>
                        <p className="text-xs uppercase tracking-widest text-zinc-500">
                            Processor
                        </p>
                        <p className="text-sm text-white">
                            {cpu}
                        </p>

                        <p className="text-xs uppercase tracking-widest text-zinc-500">
                            Graphics
                        </p>
                        <p className="text-sm text-white">
                            {gpu}
                        </p>

                        <p className="text-xs uppercase tracking-widest text-zinc-500">
                            Memory
                        </p>
                        <p className="text-sm text-white">
                            {ram}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                    <Button className="flex-1" onClick={() => navigate(`/builds/${build.id}`)}>
                        View Build
                    </Button>

                    <button className="flex items-center justify-center rounded-xl border border-zinc-700 px-4 transition-all hover:border-red-400 hover:text-red-400 cursor-pointer" onClick={() => removeBuild(build.id)}>
                        <Trash2 size={18} />
                    </button>

                    <button className="flex items-center justify-center rounded-xl border border-zinc-700 px-4 transition-all hover:border-cyan-400 hover:text-cyan-400 cursor-pointer">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </Card>
    );
}