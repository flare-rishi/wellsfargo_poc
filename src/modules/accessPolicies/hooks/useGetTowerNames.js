import { useDispatch, useSelector } from "react-redux";
import { selectData, selectRawJson, updateUniquesTowerNames } from "../slices/dataSlice/dataSlice";
import { TOWERS } from "../../../constants/constants";

function useGetTowerNames() {
    const dataJson = useSelector(selectData);
    const dispatch = useDispatch();
    function getTowerNames() {
        const sortedKeys = Object.keys(dataJson[TOWERS]).sort((a, b) => dataJson[TOWERS][a] - dataJson[TOWERS][b]);
        let tabs = [];
        let allTabNames = [];

        sortedKeys.forEach((key) => {
            allTabNames.push(key);
            tabs.push({ [key]: dataJson[TOWERS][key] });
        });

        dispatch(updateUniquesTowerNames(allTabNames.sort()));
        return tabs;
    }
    return getTowerNames;
}

export default useGetTowerNames;
