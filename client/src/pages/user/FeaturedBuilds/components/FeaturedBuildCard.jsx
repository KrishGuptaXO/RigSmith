import { useNavigate } from "react-router-dom";
import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";

export default function FeaturedBuildCard({build}) {
    const { name, cpu, gpu, ram, price, image } = build;
    const navigate = useNavigate();
    return (
        <Card className="group w-full overflow-hidden">
            
            {/* Image Container */}
            <div className="h-64 overflow-hidden rounded-xl">
                <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>

            {/* Always Visible */}
            <div className="mt-4">
                <h3 className="text-xl font-semibold text-white">
                    {name}
                </h3>

                <p className="mt-2 text-lg font-bold text-cyan-400">
                    {price}
                </p>
            </div>

            {/* Expandable Section */}
            <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:mt-5 group-hover:max-h-56 group-hover:opacity-100">
                <div className="border-t border-zinc-700 pt-5">
                    <div className="space-y-4">

                        <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Processor
                            </p>

                            <p className="text-sm text-white">
                                {cpu}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Graphics
                            </p>

                            <p className="text-sm text-white">
                                {gpu}
                            </p>
                        </div>
                    
                        <div>
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                                Memory
                            </p>

                            <p className="text-sm text-white">
                                {ram}
                            </p>
                        </div>

                    </div>

                    <Button className="mt-6 w-full" onClick={() => navigate(`/builds/${build.id}`)}>
                        View Build →
                    </Button>
                </div>
            </div>
        </Card>
    );
}