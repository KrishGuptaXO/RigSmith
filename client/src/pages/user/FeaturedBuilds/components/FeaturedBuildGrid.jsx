import { useEffect, useState } from "react";
import FeaturedBuildCard from "./FeaturedBuildCard";

export default function FeaturedBuildGrid () {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBuilds = async () => {
            try {
                const response = await fetch (
                    "http://localhost:5000/api/inventory"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch builds.");
                }

                const data = await response.json();

                setBuilds(
                    data.map((item) => ({
                        ...item,
                        id: item._id,
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch featured builds: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBuilds();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-80 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
                    <p className="mt-4 text-sm text-zinc-400">
                        Loading builds...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid items-start gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {builds.map((build) => (
                <FeaturedBuildCard
                    key={build.id}
                    build={build}
                />
            ))}
        </div>
    );
}