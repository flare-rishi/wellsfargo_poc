import { useSelector } from "react-redux";
import { selectTableVersionData } from "../../slices/tableLevelSlice/tableLevelSlice";

const useCalculateLatestVersion = () => {
  const versions = useSelector(selectTableVersionData);
  const calculateLatestVersion = () => {
    let versionArray = Object.keys(versions);
    let versionsLength = versionArray.length;
    let selectedVersion = versionArray[versionsLength - 1];
    return selectedVersion;
  };
  return calculateLatestVersion;
};

export default useCalculateLatestVersion;
