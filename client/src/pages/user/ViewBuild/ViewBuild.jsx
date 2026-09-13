import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import BuildImage from "./components/BuildImage";
import BuildDetails from "./components/BuildDetails";
import EmiCard from "./components/EmiCard";
import WarrantyCard from "./components/WarrantyCard";
import UpgradeSection from "./components/UpgradeSection";

export default function ViewBuild() {
    const { id } = useParams();

    const [build, setBuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBuild = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/builds/${id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch build.");
                }

                const data = await response.json();
                setBuild(data);
            } catch (error) {
                console.error("Failed to fetch build:", error);
                setError("Failed to load build.");
            } finally {
                setLoading(false);
            }
        };

        fetchBuild();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p>Loading build...</p>
            </div>
        );
    }

    if (error || !build) {
        return <Navigate to="/featured-builds" replace />;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <BuildImage build={build} />

                <BuildDetails build={build} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EmiCard build={build} />
                <WarrantyCard build={build} />
            </div>

            <UpgradeSection build={build} />
        </div>
    );
}