import featuredBuilds from "../../../data/featuredBuilds";
import BuildCard from "./BuildCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function FeaturedBuilds(){
    const [startIndex, setStartIndex] = useState(0);
    
    const visibleBuilds = [];
    for (let i=0; i<4; i++){
        visibleBuilds.push(featuredBuilds[(startIndex + i) % featuredBuilds.length]);
    }

    const nextBuild = () => {
        setStartIndex((prev) => (prev+1) % featuredBuilds.length);
    };
    
    const prevBuild = () => {
        setStartIndex((prev) => (prev-1 + featuredBuilds.length) % featuredBuilds.length);
    };

    const showArrows = featuredBuilds.length;

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
            <div className="relative mt-6">

                {/* Left Arrow */}
                {showArrows && (
                    <button 
                        onClick={prevBuild} 
                        className="
                            flex
                            items-center
                            justify-center
                            absolute
                            -left-4
                            top-1/2 
                            -translate-y-1/2 
                            z-20 
                            w-10 h-10
                            rounded-full 
                            bg-zinc-900/80 
                            backdrop-blur-md 
                            border border-zinc-700 
                            shadow-lg
                            opacity-70 hover:opacity-100 
                            hover:bg-zinc-800
                            hover:scale-105
                            active:scale-95 
                            hover:text-cyan-400 
                            transition-all 
                            cursor-pointer
                    ">
                        <ChevronLeft />
                    </button>
                )}

                {/* Carousel */}
                <div className="px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {visibleBuilds.map((build) => (  
                            <BuildCard key={build.id} build={build} />
                            ))}
                    </div>
                </div>

                {/* Right Arrow */}
                {showArrows && (
                    <button 
                        onClick={nextBuild} 
                        className="
                            flex
                            items-center
                            justify-center
                            absolute
                            right-0
                            top-1/2 
                            -translate-y-1/2 
                            translate-x-1/2 
                            z-20
                            w-10 h-10
                            opacity-70 hover:opacity-100
                            rounded-full 
                            bg-zinc-900/80 
                            backdrop-blur-md 
                            border border-zinc-700 
                            shadow-lg 
                            hover:bg-zinc-800
                            hover:scale-105
                            active:scale-95
                            hover:text-cyan-400 
                            transition-all 
                            cursor-pointer
                    ">
                            <ChevronRight />
                    </button>
                )}
            </div>
        </section>
    );
}