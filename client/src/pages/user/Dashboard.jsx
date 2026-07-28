import FeaturedBuilds from "../../components/dashboard/FeaturedBuilds/FeaturedBuilds";
import ImportBuild from "../../components/dashboard/ImportBuild/ImportBuild";
import RecentOrders from "../../components/dashboard/RecentOrders/RecentOrders";

export default function Dashboard(){
    return (
        <>
            <FeaturedBuilds />
            <ImportBuild />
        </>
    );
}