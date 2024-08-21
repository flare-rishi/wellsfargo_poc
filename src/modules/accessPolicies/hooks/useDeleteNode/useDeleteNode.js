import { useDispatch, useSelector } from "react-redux";
import { selectData, selectUniqueNodeNames, updateData } from "../../slices/dataSlice/dataSlice";
import {
    selectEditedNodes,
    selectUnSavableNodes,
    updateEditedNodes,
    updateUnSavableNodes,
} from "../../slices/save/saveSlice";
import { selectActiveTab, selectEditMe } from "../../slices/crud/crudSlice";
import useSetUnique from "../useSetUnique/useSetUnique";
import useUnlayeredChilds from "../common/useUnlayeredChilds";
import { updateEditMe } from "../../slices/crud/crudSlice";
import { extractNumber, removeFromEditMe } from "../../utils/utilities";
import { selectSelectedNodes } from "../../slices/flowSlice/flowSlice";
import useHandleClick from "../useHandleClick/usehandleClick";
import { CHILDS, EDITME, INTERPARENTS, PARENTS, UNLAYEREDCHILDS } from "../../../../constants/constants";

function useDeleteNode() {
    const dispatch = useDispatch();
    const { deleteFromUnlayeredChilds } = useUnlayeredChilds();
    var dataJson = { ...useSelector(selectData) };
    const unSavableNodes = useSelector(selectUnSavableNodes);
    const activeTab = useSelector(selectActiveTab);
    const uniqueNodeNames = useSelector(selectUniqueNodeNames);
    const editedNodes = useSelector(selectEditedNodes);
    var editMe = [...useSelector(selectEditMe)];
    const selectedNodes = useSelector(selectSelectedNodes);
    const setUnique = useSetUnique();

    const { handleClick } = useHandleClick();

    function deleteNode(layerName, nodeName) {
        var tower_dataJson = { ...dataJson[activeTab] };

        var childs = tower_dataJson[layerName][nodeName][CHILDS];
        let inter_childs = tower_dataJson[layerName][nodeName][UNLAYEREDCHILDS] || [];

        //delete a node only if its a leaf node
        if (Object.keys(childs).length == 0 && Object.keys(inter_childs).length == 0) {
            //case if the policy is an inter-tower policy
            if (tower_dataJson[layerName][nodeName][INTERPARENTS]) {
                dataJson = deleteInterConnections(nodeName, layerName, dataJson);
            }

            if (nodeName.includes(EDITME)) {
                let num = extractNumber(nodeName);
                editMe = [...removeFromEditMe(editMe, num)];
                dispatch(updateEditMe(editMe));
            }

            if (nodeName.includes(EDITME)) {
                dispatch(updateUnSavableNodes(unSavableNodes - 1));
            }

            //deletes the node form that tower data
            tower_dataJson = {
                ...deletetower_dataJson(layerName, nodeName, tower_dataJson),
            };

            if (selectedNodes[nodeName]) {
                handleClick(nodeName, layerName);
            }

            setUnique(uniqueNodeNames, nodeName, null, "node");
            dataJson[activeTab] = { ...tower_dataJson };
            dispatch(updateData({ ...dataJson }));

            return 1;
        }
        return 0;
    }

    //this handle the deletion of a policy main deletion function
    function deletetower_dataJson(layer, nodeName, tower_dataJson) {
        var parentsData = tower_dataJson[layer][nodeName][PARENTS];

        tower_dataJson = deleteFromParentChilds(parentsData, tower_dataJson, nodeName, layer);

        let layerdata = { ...tower_dataJson[layer] };

        delete layerdata[nodeName];

        if (Object.keys(layerdata).length == 0) {
            delete tower_dataJson[layer];
        } else {
            tower_dataJson = { ...tower_dataJson, [layer]: { ...layerdata } };
        }

        //delete edited node record
        let newEditedNode = editedNodes.filter((editedNode) => editedNode.nodeName !== nodeName);

        dispatch(updateEditedNodes(newEditedNode));
        return tower_dataJson;
    }

    //this delete the inter-tower parents connection
    function deleteInterConnections(nodeName, layerName, dataJson) {
        var inter_mem = dataJson[activeTab][layerName][nodeName][INTERPARENTS];
        for (let x = 0; x < inter_mem.length; x++) {
            dataJson = {
                ...deleteFromUnlayeredChilds(inter_mem[x], nodeName, activeTab, dataJson),
            };
        }

        return dataJson;
    }

    //this delete the entry from each parent nodes childs section
    function deleteFromParentChilds(parentsData, tower_dataJson, nodeName, layer) {
        for (let parentLayer in parentsData) {
            let parents = parentsData[parentLayer];
            for (let i = 0; i < parents.length; i++) {
                let parentChildsLayerData = [...tower_dataJson[parentLayer][parents[i]][CHILDS][layer]];
                let index = parentChildsLayerData.indexOf(nodeName);
                parentChildsLayerData.splice(index, 1);
                let UpdatedChilds;
                if (parentChildsLayerData.length !== 0) {
                    UpdatedChilds = {
                        ...tower_dataJson[parentLayer][parents[i]][CHILDS],
                        [layer]: [...parentChildsLayerData],
                    };
                } else {
                    UpdatedChilds = { ...tower_dataJson[parentLayer][parents[i]][CHILDS] };
                    delete UpdatedChilds[layer];
                }

                let updatedparents = {
                    ...tower_dataJson[parentLayer][parents[i]],
                    childs: { ...UpdatedChilds },
                };
                let updatedlayer = {
                    ...tower_dataJson[parentLayer],
                    [parents[i]]: { ...updatedparents },
                };

                tower_dataJson[parentLayer] = { ...updatedlayer };
            }
        }

        return tower_dataJson;
    }

    return deleteNode;
}

export default useDeleteNode;
