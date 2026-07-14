import Button from "./common/Button";
import Card from "./common/Card";

export default function BuildCard({build}) {
    const { name, cpu, gpu, ram, price, image } = build;
    return (
        <Card>
            <div className="h-40 rounded-lg bg-zinc-700">
                {image}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-white">
                {name}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
                {cpu}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
               {gpu}
            </p>

            <p className="mt-2 text-sm text-zinc-400">
                {ram}
            </p>
            
            <p className="mt-3 text-lg font-bold text-white">
                {price}
            </p>

            <Button>
                View Build
            </Button>

        </Card>
    );
}