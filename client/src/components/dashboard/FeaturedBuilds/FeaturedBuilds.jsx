import featuredBuilds from "../../../data/featuredBuilds";
import BuildCard from "./BuildCard";
import "./FeaturedBuilds.css";
const scrollingBuilds = [...featuredBuilds, ...featuredBuilds];

export default function FeaturedBuilds(){
        
    return(
        <section>

            {/* Title Row */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Featured Builds
                </h1>

                <button className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer">
                    View All →
                </button>
            </div>

            {/* Cards */}
            <div className="featured-builds-container relative mt-6">

                {/* Infinite */}
                <div className="featured-builds-track flex gap-4">
                    {scrollingBuilds.map((build,index) => {
                        return (
                            <div 
                                key={`${build.id}-${index}`}
                                className="shrink-0 px-1 w-[360px]"
                            >
                                <BuildCard build={build} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}