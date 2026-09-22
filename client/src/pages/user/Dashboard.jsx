import FeaturedBuilds from "../../components/dashboard/FeaturedBuilds/FeaturedBuilds";
import ImportBuild from "../../components/dashboard/ImportBuild/ImportBuild";
import WhyChooseUs from "../../components/dashboard/Footer/WhyChooseUs";

export default function Dashboard(){
    return (
        <>
            <FeaturedBuilds />
            <ImportBuild />
            <WhyChooseUs />
        </>
    );
}