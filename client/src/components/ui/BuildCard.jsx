export default function BuildCard({build}) {
    const { name, cpu, gpu, ram, price, image } = build;
    return (
        <div className="w-72 rounded-xl border border-zinc-800 bg-[#161B22] p-4">
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

            <button className="cursor-pointer mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium hover:bg-blue-700 hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-200">
                View Build
            </button>

        </div>
    );
}