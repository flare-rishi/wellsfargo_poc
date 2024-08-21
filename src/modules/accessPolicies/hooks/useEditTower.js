import { EDITME, FILTER, MASKS, NAME, PIIVISIBILITY, PREEDIT, TOWERS } from "../../../constants/constants";
import { selectActiveTab, updateActiveTab, updateEditModalData } from "../slices/crud/crudSlice";
import { selectData, updateData, selectTowers, updateTowers } from "../slices/dataSlice/dataSlice";
import { selectUnSavableTabs, updateUnSavableTabs } from "../slices/save/saveSlice";
import { useDispatch, useSelector } from "react-redux";
function useEditTower() {
    const dispatch = useDispatch();
    const dataJson = useSelector(selectData);
    const oldName = useSelector(selectActiveTab);
    const unSavableTabs = useSelector(selectUnSavableTabs);
    var reduxTowers = [...useSelector(selectTowers)];

    function editTower(newName, filter = null, masks = null, pii_visibility = null) {
        var tempDataJson = { ...dataJson };
        var towers = { ...tempDataJson[TOWERS] };

        if (newName != oldName) {
            dispatch(updateTowers(updateReduxTowers(newName, towers, oldName, reduxTowers)));
        }

        // console.log("newTowers", newTowers);

        tempDataJson = { ...tempDataJson, towers: { ...updateTowersInDataJson(towers, newName, oldName) } };

        ///now rename the tempName down below in json

        let towerPolicy = updateTowerPolicy(tempDataJson[oldName], filter, masks, pii_visibility, oldName);

        // console.log("tower policy ", towerPolicy);

        //updating the edited tower object in edit model

        let editedTowerPolicy = {};
        editedTowerPolicy[PREEDIT] = towerPolicy[PREEDIT];
        editedTowerPolicy[MASKS] = towerPolicy[MASKS];
        editedTowerPolicy[FILTER] = towerPolicy[FILTER];
        editedTowerPolicy["name"] = newName;
        editedTowerPolicy["type"] = "tower";
        editedTowerPolicy[PIIVISIBILITY] = towerPolicy[PIIVISIBILITY];

        // console.log("editedTowerPolicy", editedTowerPolicy);

        dispatch(updateEditModalData(editedTowerPolicy));

        tempDataJson[newName] = { ...towerPolicy };

        if (oldName !== newName) delete tempDataJson[oldName];

        // console.log("after tower edit data json  = ", tempDataJson);
        dispatch(updateData(tempDataJson));
        if ((newName !== EDITME && oldName.includes(EDITME)) || oldName.includes("_copy")) {
            dispatch(updateUnSavableTabs(unSavableTabs - 1));
        }

        dispatch(updateActiveTab(newName));
    }

    return editTower;
}

//
//
//
//
function updateReduxTowers(newName, towers, oldName, reduxTowers) {
    for (let i = 0; i < reduxTowers.length; i++) {
        if (reduxTowers[i][oldName]) {
            reduxTowers[i] = { [newName]: towers[oldName] };
        }
    }
    return reduxTowers;
}

//
//
//
//
function updateTowersInDataJson(towers, newName, oldName) {
    let newTowers = {};
    for (let tower in towers) {
        if (tower === oldName) {
            newTowers[newName] = towers[oldName];
        } else {
            newTowers[tower] = towers[tower];
        }
    }
    return newTowers;
}

//
//
//
//
function updateTowerPolicy(towerPolicy, filter, masks, pii_visibility, oldName) {
    towerPolicy = { ...towerPolicy };

    if (!towerPolicy[PREEDIT]) {
        towerPolicy[PREEDIT] = createPreEditObject(towerPolicy, oldName);
    }

    towerPolicy = updatePolicyField(towerPolicy, FILTER, filter);
    towerPolicy = updatePolicyField(towerPolicy, MASKS, masks);
    towerPolicy = updatePolicyField(towerPolicy, PIIVISIBILITY, pii_visibility);
    return towerPolicy;
}

//
//
//
//
function updatePolicyField(towerPolicy, fieldName, fieldValue) {
    if (fieldValue !== null) {
        if (fieldValue === "") {
            delete towerPolicy[fieldName];
        } else {
            towerPolicy[fieldName] = fieldValue;
        }
    }
    return towerPolicy;
}

//
//
//
//
function createPreEditObject(towerPolicy, oldName) {
    return {
        name: oldName,
        ...(towerPolicy[MASKS] && { [MASKS]: towerPolicy[MASKS] || null }),
        ...(towerPolicy[FILTER] && { [FILTER]: towerPolicy[FILTER] || null }),
        ...(towerPolicy[PIIVISIBILITY] && {
            [PIIVISIBILITY]: towerPolicy[PIIVISIBILITY] || null,
        }),
    };
}

//
//
//
//

export default useEditTower;
