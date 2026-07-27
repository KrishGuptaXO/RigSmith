import { useParams } from "react-router-dom";
import BuildImage from "./components/BuildImage";
import BuildDetails from "./components/BuildDetails";
import EmiCard from "./components/EmiCard";
import WarrantyCard from "./components/WarrantyCard";
// import UpgradeOption from "./components/UpgradeOption";
import UpgradeSection from "./components/UpgradeSection";
import builds from "../../../data/builds";


export default function ViewBuild(){
    const { id } = useParams();
    const build = builds.find((b) => b.id === id);
    return (
        <section className="space-y-8">
            
            {/* Heading */}
            <div>
                <h1 className="text-4xl font-bold">
                    Review your Build
                </h1>
            </div>

            {/* Hero */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <BuildImage build={build} />

                <BuildDetails build={build} />

            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <EmiCard />

                <WarrantyCard />

            </div>

            {/* Upgrade */}
            <UpgradeSection />

        </section>
    );
}