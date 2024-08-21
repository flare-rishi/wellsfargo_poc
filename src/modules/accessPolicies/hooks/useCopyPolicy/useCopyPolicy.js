import { useSelector } from "react-redux";
import useCreateNode from "../../hooks/useCreateNode/useCreateNode";
import { selectData } from "../../slices/dataSlice/dataSlice";
import { selectActiveTab } from "../../slices/crud/crudSlice";
import { EDITME, FILTER, MASKS, MEMBEROF, PIIVISIBILITY } from "../../../../constants/constants";

function useCopyPolicy() {
    const activeTab = useSelector(selectActiveTab);
    const dataJson = useSelector(selectData);
    const towerDataJson = dataJson[activeTab];
    const createNode = useCreateNode();

    function copyPolicy(copyOfPolicy, layer) {
        // Object to store copied policy data
        let dataToBeCopied = {};

        // Extracting data from the policy to be copied
        const copyOfPolicyData = towerDataJson[layer][copyOfPolicy];

        // Copying filter if available
        dataToBeCopied[FILTER] = copyOfPolicyData?.[FILTER];

        // Copying masks if available
        dataToBeCopied[MASKS] = copyOfPolicyData?.[MASKS];

        // Copying member_of if available, or initializing as an empty array
        dataToBeCopied[MEMBEROF] = copyOfPolicyData?.[MEMBEROF] || [];

        // Copying pii_visibility if available, or initializing as an empty array
        dataToBeCopied[PIIVISIBILITY] = copyOfPolicyData?.[PIIVISIBILITY] || [];

        // Create a new node with placeholder text and copied data
        createNode(EDITME, JSON.stringify(dataToBeCopied));
    }

    return copyPolicy;
}

export default useCopyPolicy;
