import Button from "./common/Button";
import Card from "./common/Card";
import ProgressBar from "./ProgressBar";

export default function ContinueBuildInfo ({cont}) {
    const { name, progress, completedComponents, totalComponents, lastEdited} = cont;
    return (
        <Card>
            <h3 className="mt-4 text-xl font-semibold text-white">
                {name}
            </h3>

            <ProgressBar completedSteps={completedComponents} />
            
            <p className="mt-2 text-sm text-zinc-400">
                {completedComponents} / {totalComponents} Components Selected
            </p>
            
            <p className="mt-3 text-sm text-zinc-400">
                Last Edited: {lastEdited}
            </p>

            <Button className="mt-4 w-full">
                Continue Build
            </Button>
        </Card>
    );
}