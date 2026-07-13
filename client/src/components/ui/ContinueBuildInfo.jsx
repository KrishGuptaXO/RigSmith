import ProgressBar from "./ProgressBar";

export default function ContinueBuildInfo ({cont}) {
    const { name, progress, completedComponents, totalComponents, lastEdited} = cont;
    return (
        <div className="w-full rounded-xl border border-zinc-800 bg-[#161B22] p-4">
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

            <button className="mt-4 w-fit rounded-lg bg-blue-600 px-6 py-2 font-medium hover:bg-blue-700 hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-200 cursor-pointer">
                Continue Build
            </button>
        </div>
    );
}