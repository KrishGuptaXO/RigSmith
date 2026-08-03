import FeaturedBuildCard from "./components/FeaturedBuildCard";
import FeaturedBuildGrid from "./components/FeaturedBuildGrid";

export default function FeaturedBuilds() {
    return (
        <section className="mx-auto max-w-7xl space-y-10 px-2 py-4">
            <div>
                <h1 className="text-4xl font-bold text-white">
                    Featured Builds
                </h1>

                <p className="mt-2 text-zinc-400">
                    Explore expertly curated gaming and workstation PCs built by RigSmith.
                </p>
            </div>

            <FeaturedBuildGrid />
        </section>
    )
}