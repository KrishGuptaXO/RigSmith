import { Link } from "react-router-dom";
import BuildCard from "./BuildCard";
import "./FeaturedBuilds.css";
import { useEffect, useState } from "react";

export default function FeaturedBuilds(){
    const [featuredBuilds, setFeaturedBuilds] = useState([]);

    useEffect(() => {
        const fetchBuilds = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/builds"
                );

                if (!response.ok) throw new Error("Failed to fetch builds.");

                const data = await response.json();
                setFeaturedBuilds(data);
            } catch (error) {
                console.error("Failed to fetch featured builds: ", error);
            }
        };

        fetchBuilds();
    }, []);

    const scrollingBuilds = [...featuredBuilds, ...featuredBuilds];

    return (
        <section>
            {/* Title Row */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Featured Builds
                </h1>

                <Link
                    to="/featured-builds"
                    className="text-cyan-400 transition hover:text-cyan-300"
                >
                    View All →
                </Link>
            </div>

            {/* Cards */}
            <div className="featured-builds-container relative mt-6 w-full min-w-0">
                {/* Infinite */}
                <div className="featured-builds-track flex gap-4">
                    {scrollingBuilds.map((build, index) => (
                        <div
                            key={`${build._id}-${index}`}
                            className="w-[360px] shrink-0 px-1"
                        >
                            <BuildCard build={build} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}