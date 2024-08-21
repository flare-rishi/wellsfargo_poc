import { useDispatch, useSelector } from "react-redux";
import { selectData, updateData } from "../../slices/dataSlice/dataSlice";
import { PII, PREEDIT } from "../../../../constants/constants";

function UseEditTableLevelPii() {
    let dataJson = { ...useSelector(selectData) };
    const dispatch = useDispatch();
    function editPii(newPiiValue) {
        let newPiiValueArray;
        if (typeof newPiiValue === "string") {
            newPiiValueArray = newPiiValue.split(",");
        } else {
            newPiiValueArray = newPiiValue;
        }

        if (dataJson[PREEDIT]) {
            dataJson = { ...dataJson, [PII]: newPiiValueArray };
        } else {
            dataJson = { ...dataJson, [PREEDIT]: dataJson[PII] };
            dataJson = { ...dataJson, [PII]: newPiiValueArray };
        }

        dispatch(updateData(dataJson));
    }

    return editPii;
}

export default UseEditTableLevelPii;
