import ProgressBar from "../ui/ProgressBar";
import ContinueBuildInfo from "../ui/ContinueBuildInfo";
import currentBuild from "../../data/currentBuild";
import Card from "../ui/common/Card";

export default function ContinueBuildCard(){
    return(
        <Card>
            {/* Title Row */}
            <h2>Continue your Last Build</h2>

            <ContinueBuildInfo cont={currentBuild} />
        </Card>
    );
}