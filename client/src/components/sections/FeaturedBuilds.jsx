import Button from "../ui/common/Button"
import featuredBuilds from "../../data/featuredBuilds";
import BuildCard from "../ui/BuildCard";
import Card from "../ui/common/Card";

export default function FeaturedBuilds(){
    return(
        <Card>
            {/* Title Row */}

            <div>
                <h2>Featured Builds</h2>

                <Button>
                    View All
                </Button>
            </div>

            {/* Cards */}

            <div>
                {featuredBuilds.map((build)=>(
                    <BuildCard
                        key={build.id}
                        build={build}
                    />
                ))}
            </div>

        </Card>
    );
}