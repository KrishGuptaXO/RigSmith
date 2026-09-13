import { useEffect, useState } from "react";
import FeaturedBuildCard from "./FeaturedBuildCard";

export default function FeaturedBuildGrid() {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBuilds = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/builds");

                if (!response.ok) {
                    throw new Error("Failed to fetch builds.");
                }

                const data = await response.json();
                setBuilds(data);
            } catch (error) {
                console.error("Failed to fetch builds:", error);
                setError("Failed to load builds.");
            } finally {
                setLoading(false);
            }
        };

        fetchBuilds();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <p>Loading builds...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center py-12">
                <p>{error}</p>
            </div>
        );
    }

    if (builds.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <p>No builds available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {builds.map((build) => (
                <FeaturedBuildCard key={build._id} build={build} />
            ))}
        </div>
    );
}