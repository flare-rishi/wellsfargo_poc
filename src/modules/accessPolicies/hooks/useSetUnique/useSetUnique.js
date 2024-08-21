import { useDispatch } from "react-redux";
import {
  updateUniquesNodeNames,
  updateUniquesTowerNames,
} from "../../slices/dataSlice/dataSlice";

const useSetUnique = () => {
  const dispatch = useDispatch();
  const setUnique = (uniqueList, oldName, newName, type) => {
    // console.log(uniqueList, oldName, newName, type);
    let indexOfTower = uniqueList.indexOf(oldName);
    // console.log("indexOfTower", indexOfTower);
    let mutableTowerNames = [...uniqueList];
    if (newName === null) {
      mutableTowerNames.splice(indexOfTower, 1); // Remove the element at the specified index
    } else {
      mutableTowerNames.splice(indexOfTower, 1, newName); // Replace the element at the specified index with newName
    }

    if (type === "node")
      dispatch(updateUniquesNodeNames(mutableTowerNames.sort()));
    else if (type === "tower")
      dispatch(updateUniquesTowerNames(mutableTowerNames.sort()));
  };

  return setUnique;
};

export default useSetUnique;
