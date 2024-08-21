import { useSelector } from "react-redux";
import { selectData } from "../../slices/dataSlice/dataSlice";
import useCreateNode from "../useCreateNode/useCreateNode";
import toast from "react-hot-toast";
import { selectActiveTab } from "../../slices/crud/crudSlice";
import { EDITME, MEMBEROF } from "../../../../constants/constants";
function useCreateChildNode() {
    const activeTower = useSelector(selectActiveTab);
    const towerDataJson = useSelector(selectData)[activeTower];
    const createNode = useCreateNode();

    function createChildNode(layer, nodeName) {
        // Get the index of the parent node
        const indexOfParentNode = Object.keys(towerDataJson[layer]).indexOf(nodeName);

        // Define the node data with the parent node membership
        const nodeData = `{"${MEMBEROF}":["${nodeName}"]}`;

        // Create the child node with placeholder name and data
        createNode(EDITME, nodeData, indexOfParentNode);

        // Display success toast notification
        toast.success("Child node created successfully");
    }
    return createChildNode;
}

export default useCreateChildNode;
