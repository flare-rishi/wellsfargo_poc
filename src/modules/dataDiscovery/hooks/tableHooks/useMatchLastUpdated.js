import { useSelector } from "react-redux";
import { selectLatestVersion } from "../../slices/tableLevelSlice/tableLevelSlice";
import { UPDATED } from "../../../../constants/constants";

const useMatchLastUpdated = () => {
    const latestVersion = useSelector(selectLatestVersion);
    function checkForLastUpdate(lastUpdatedNew) {
        if (latestVersion[UPDATED] !== lastUpdatedNew) {
            console.log("use match called");
        }
    }

    return checkForLastUpdate;
};

export default useMatchLastUpdated;
