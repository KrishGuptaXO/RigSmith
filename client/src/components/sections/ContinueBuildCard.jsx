import ProgressBar from "../ui/ProgressBar";
import ContinueBuildInfo from "../ui/ContinueBuildInfo";
import currentBuild from "../../data/currentBuild";

export default function ContinueBuildCard(){
    return(
        <section>
            {/* Title Row */}
            <h2>Continue your Last Build</h2>

            <ContinueBuildInfo cont={currentBuild} />
        </section>
    );
}