import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/common/Button";
import Card from "../../../../components/common/Card";

export default function FeaturedBuildCard({build}) {
    const { name, price, image, specs = [] } = build;
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    // Show first 3 specs (typically Processor, Graphics, Memory)
    const previewSpecs = specs.slice(0, 3);

    return (
        <Card
            className="w-full overflow-hidden"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            
            {/* Image Container */}
            <div className="h-64 overflow-hidden rounded-xl">
                <img
                    src={image}
                    alt={name}
                    className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : ""}`}
                />
            </div>

            {/* Name + Price — same line */}
            <div className="mt-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                    {name}
                </h3>

                <p className="text-lg font-bold text-cyan-400">
                    {price}
                </p>
            </div>

            {/* Expandable Section — only this card */}
            <div
                className={`overflow-hidden transition-all duration-500 ${
                    hovered ? "mt-5 max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="border-t border-zinc-700 pt-5">
                    <div className="space-y-4">

                        {previewSpecs.map((spec) => (
                            <div key={spec.label}>
                                <p className="text-xs uppercase tracking-widest text-zinc-500">
                                    {spec.label}
                                </p>

                                <p className="text-sm text-white">
                                    {spec.value}
                                </p>
                            </div>
                        ))}

                    </div>

                    <Button className="mt-6 w-full" onClick={() => navigate(`/builds/${build.id}`)}>
                        View Build →
                    </Button>
                </div>
            </div>
        </Card>
    );
}