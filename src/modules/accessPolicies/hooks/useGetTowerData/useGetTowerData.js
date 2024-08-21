import { useSelector } from "react-redux";
import { selectData } from "../../slices/dataSlice/dataSlice";
import {
  FILTER,
  MASKS,
  PIIVISIBILITY,
  PREEDIT,
} from "../../../../constants/constants";

function useGetTowerData() {
  const dataJson = useSelector(selectData);
  function getTowerData(towerName) {
    var towerData = dataJson[towerName];

    var returnTowerData = {};

    returnTowerData["name"] = towerName;
    if (towerData[FILTER]) {
      returnTowerData[FILTER] = towerData[FILTER];
    } else {
      returnTowerData[FILTER] = "";
    }

    if (towerData[MASKS]) {
      returnTowerData[MASKS] = towerData[MASKS];
    } else {
      returnTowerData[MASKS] = "";
    }

    if (towerData[PREEDIT]) {
      returnTowerData[PREEDIT] = towerData[PREEDIT];
    }

    if (towerData[PIIVISIBILITY]) {
      returnTowerData[PIIVISIBILITY] = towerData[PIIVISIBILITY];
    } else {
      returnTowerData[PIIVISIBILITY] = "";
    }
    return returnTowerData;
  }
  return getTowerData;
}

export default useGetTowerData;
