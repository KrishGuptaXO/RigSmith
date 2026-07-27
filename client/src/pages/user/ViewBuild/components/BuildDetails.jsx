import { ShoppingBasket } from 'lucide-react';
import Card from "../../../../components/common/Card";
import Button from "../../../../components/common/Button";

export default function BuildDetails({build}) {
    const quickSpecs = build.specs.filter(specs => 
        ["Processor", "Graphics Card", "Memory"].includes(specs.label)
    );

    return (
        <Card className="flex h-full flex-col">
            <div className="space-y-4">

                <div>
                    <h2 className="text-3xl font-bold">
                        {build.name}
                    </h2>
                </div>

                <div>
                    <p className="text-4xl font-bold text-primary">
                        {build.price}
                    </p>
                </div>

                <div className="space-y-3 pt-2">
                    {quickSpecs.map(spec => (
                        <div key={spec.label} className="flex justify-between border-b border-gray-700 pb-2">
                            
                            <span className="text-gray-400">
                                {spec.label}
                            </span>

                            <span className="font-medium text-right">
                                {spec.value}
                            </span>

                        </div>
                    ))}

                </div>

            </div>
            
            <div className="mt-auto pt-8">
                <Button className="w-full">
                    Add to Cart <span> <ShoppingBasket /> </span>
                </Button>
            </div>

        </Card>
    );
}