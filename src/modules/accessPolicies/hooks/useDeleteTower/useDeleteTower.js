// Importing necessary functions from Redux and utilities
import { useDispatch, useSelector } from "react-redux";
import {
    selectEditedTowers,
    selectUnSavableTabs,
    updateEditedTowers,
    updateUnSavableTabs,
} from "../../slices/save/saveSlice";
import { updateData, selectData, selectTowers, updateTowers } from "../../slices/dataSlice/dataSlice";
import { getLayersOfTower } from "../../utils/utilities";
import { EDITME, TOWERS } from "../../../../constants/constants";

// Custom React hook for deleting towers
function useDeleteTower() {
    const dispatch = useDispatch(); // Dispatch function from Redux
    var dataJson = { ...useSelector(selectData) }; // Getting data from Redux store
    const unSavableTabs = useSelector(selectUnSavableTabs); // Getting unsavable tabs from Redux store
    const editedTower = useSelector(selectEditedTowers); // Getting edited towers from Redux store
    var towers = [...useSelector(selectTowers)]; // Getting towers from Redux store

    // Function to delete a tower
    function deleteTower(towerName) {
        var layers = getLayersOfTower(dataJson[towerName]); // Getting layers of the tower
        if (layers.length == 0) {
            // If tower has no layers
            delete dataJson[towerName]; // Deleting tower from data
            let newTowers = [];
            // Removing tower from the list of towers
            for (let x = 0; x < towers.length; x++) {
                if (towers[x][towerName]) {
                } else {
                    newTowers.push(towers[x]);
                }
            }
            // Updating towers in Redux store
            dispatch(updateTowers(newTowers));
        } else {
            console.log("Tower not empty hence not deleted");
            return 0; // Tower not deleted
        }
        delete_from_towers(towerName); // Deleting tower from towers data
        delete dataJson[towerName]; // Deleting tower from data

        // Updating data in Redux store
        dispatch(updateData(dataJson));
        // Removing tower from edited towers list
        let newEditedTower = editedTower.filter((edit) => edit !== towerName);
        dispatch(updateEditedTowers(newEditedTower));

        // Adjusting unsavable tabs count if tower was a new or copied tower
        if (towerName.includes(EDITME)) {
            dispatch(updateUnSavableTabs(unSavableTabs - 1));
        }

        return 1; // Tower deleted successfully
    }

    // Function to delete tower from towers data
    function delete_from_towers(towerName) {
        // Deleting tower ID from towers data and adjusting ID count for below ones
        var towers = { ...dataJson[TOWERS] };
        delete towers[towerName];
        dataJson[TOWERS] = { ...towers };
    }

    return deleteTower; // Returning the deleteTower function
}

export default useDeleteTower; // Exporting the custom hook
