import { useParams, Navigate } from "react-router-dom";
import BuildImage from "./components/BuildImage";
import BuildDetails from "./components/BuildDetails";
import EmiCard from "./components/EmiCard";
import WarrantyCard from "./components/WarrantyCard";
import UpgradeSection from "./components/UpgradeSection";
import builds from "../../../data/builds";

export default function ViewBuild() {
    const { id } = useParams();
    const build = builds.find((b) => b.id === id);

    if (!build) {
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