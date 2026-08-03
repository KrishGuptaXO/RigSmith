import builds from "../../../../data/builds";
import FeaturedBuildCard from "./FeaturedBuildCard";

export default function FeaturedBuildGrid () {
    return (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {builds.map((build) => (
                <FeaturedBuildCard key={build.id} build={build} />
            ))}
        </div>
    );
}