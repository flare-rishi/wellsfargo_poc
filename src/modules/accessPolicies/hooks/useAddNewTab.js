import { useDispatch, useSelector } from "react-redux";
import { selectData, selectTowers, updateData, updateTowers } from "../slices/dataSlice/dataSlice";

import { selectUnSavableTabs, updateUnSavableTabs } from "../slices/save/saveSlice";
import { EDITME, FILTER, LASTIDUSED, MASKS, TOWERS, VERSIONS } from "../../../constants/constants";

function useAddNewTab() {
    //
    const towers = useSelector(selectTowers);
    const dispatch = useDispatch();
    const dataJson = useSelector(selectData);
    const unSavableTabs = useSelector(selectUnSavableTabs);

    //
    //
    function addNewTab(towerDetails) {
        let newDataJson = initializeNewDataJson(dataJson);
        let newTowerName = generateNewTowerName(towerDetails);
        let newTowerEntry = createNewTowerEntry(newDataJson, newTowerName);

        newDataJson[TOWERS] = { ...newDataJson[TOWERS], ...newTowerEntry };

        if (towerDetails) {
            newDataJson[newTowerName] = {
                ...(towerDetails[FILTER] !== "" && { [FILTER]: towerDetails[FILTER] }),
                ...(towerDetails[MASKS] && { [MASKS]: towerDetails[MASKS] }),
            };
        } else {
            newDataJson[newTowerName] = {};
        }

        dispatch(updateData(newDataJson));
        dispatch(updateTowers([...towers, newTowerEntry]));
        dispatch(updateUnSavableTabs(unSavableTabs + 1));
    }
    return addNewTab;
}

//
//
//
//
function initializeNewDataJson(dataJson) {
    const newDataJson = { ...dataJson };

    if (!newDataJson[VERSIONS]) {
        newDataJson[VERSIONS] = 1;
    }

    if (!newDataJson[LASTIDUSED]) {
        newDataJson[LASTIDUSED] = 1;
    }

    return newDataJson;
}

//
//
//
//
//
function generateNewTowerName(towerDetails) {
    return (towerDetails && towerDetails.name && `${towerDetails.name}_copy`) || EDITME;
}

//
//
//
//

function createNewTowerEntry(dataJson, newTowerName) {
    if (dataJson[TOWERS]) {
        return { [newTowerName]: Object.keys(dataJson[TOWERS]).length + 1 };
    } else {
        return { [newTowerName]: 1 };
    }
}

//
//
//
//
//

export default useAddNewTab;
