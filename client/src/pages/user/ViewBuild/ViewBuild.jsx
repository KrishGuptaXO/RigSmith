import { useParams, Navigate } from "react-router-dom";


import BuildImage from "./components/BuildImage";
import BuildDetails from "./components/BuildDetails";
import EmiCard from "./components/EmiCard";
import WarrantyCard from "./components/WarrantyCard";
import UpgradeSection from "./components/UpgradeSection";
import { useEffect, useState } from "react";

export default function ViewBuild() {
    const { id } = useParams();

    const [build, setBuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBuild = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/inventory/${id}`
                );

                const data = await response.json();

                if (!data) {
                    throw new Error (
                        data.message || "Failed to fetch build."
                    );
                }

                setBuild({
                    ...data,
                    id: data._id,
                });
            } catch (error) {
                console.error("Failed to fetch build: ", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBuild();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-80 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-cyan-400" />
                    <p className="mt-4 text-sm text-zinc-400">
                        Loading build...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !build) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="space-y-6 pb-12">
            {/* Heading */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                    Review your Build
                </h1>

                <p className="text-gray-400 text-sm mt-1">
                    Everything you need to know before you buy.
                </p>
            </div>

            {/* Hero — Image + Details */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <BuildImage build={build} />
                <BuildDetails build={build} />
            </div>

            {/* Info Cards — EMI + Warranty */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <EmiCard build={build} />
                <WarrantyCard build={build} />
            </div>

            {/* Upgrade Section */}
            <UpgradeSection />
        </section>
    );
}