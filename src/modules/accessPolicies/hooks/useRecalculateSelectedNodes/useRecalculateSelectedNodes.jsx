import { useDispatch, useSelector } from "react-redux";
import { selectSelectedNodes, updateSelectedNodes } from "../../slices/flowSlice/flowSlice";
import useHandleClick from "../useHandleClick/usehandleClick";

function useRecalculateSelectedNodes() {
    //it recalculates the selectedNodes after Edit in DataJson so that selected Nodes can be visible even after edit
    const { selectOrUnselect } = useHandleClick();
    var selectedNodes = {};
    function recalculateSelectedNodes(selectedPolicy, towerDataJson, split) {
        selectedNodes = {};

        for (let node in selectedPolicy) {
            selectedNodes = selectOrUnselect(
                node,
                selectedPolicy[node]["policyLayer"],
                selectedNodes,
                towerDataJson,
                split
            );
        }

        return selectedNodes;
    }

    return recalculateSelectedNodes;
}

export default useRecalculateSelectedNodes;
