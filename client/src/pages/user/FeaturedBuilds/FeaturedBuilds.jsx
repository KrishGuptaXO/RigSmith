import FeaturedBuildCard from "./components/FeaturedBuildCard";
import FeaturedBuildGrid from "./components/FeaturedBuildGrid";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedBuilds() {
    const navigate = useNavigate();

    return (
        <section className="mx-auto max-w-7xl space-y-10 px-6 py-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="p-2 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-[#161B22] transition-all duration-200 cursor-pointer"
                >
                    <ArrowLeft size={22} />
                </button>

                <div>
                    <h1 className="text-4xl font-bold text-white">
                        Featured Builds
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Explore expertly curated gaming and workstation PCs built by RigSmith.
                    </p>
                </div>
            </div>

            <FeaturedBuildGrid />
        </section>
    )
}