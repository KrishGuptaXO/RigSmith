import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import Card from "../../common/Card";

export default function BuildCard({build}) {
    const { name, cpu, gpu, ram, price, image } = build;
    const navigate = useNavigate();
    return (
        <Card className="w-full">
            
            {/* Image Container */}
            <div className="relative group h-64 overflow-hidden rounded-xl">
                <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col bg-black/60 p-5 opacity-0 transition-all duration-300 group-hover:opacity-100">

                    <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#F5DEB3] text-decoration-line: underline underline-offset-5">
                        Specifications
                    </h4>

                    <div className="space-y-4">
                        <div className="text-xs uppercase tracking-wider text-zinc-400">
                            CPU
                            <p className="text-xs font-medium text-white">
                                {cpu}
                            </p>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-zinc-400">
                            GPU
                            <p className="text-xs font-medium text-white line-clamp-2">
                                {gpu}
                            </p>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-zinc-400">
                            RAM
                            <p className="text-xs font-medium text-white">
                                {ram}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom */}
            <div className="mt-4">
                <h3 className="text-xl font-semibold">
                    {name}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-bold">
                    {price}
                </p>
                <Button onClick={() => navigate(`/builds/${build.id}`)}>
                    View Build →
                </Button>

                </div>
            </div>
        </Card>
    );
}