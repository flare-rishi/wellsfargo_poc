import { useSelector, useDispatch } from "react-redux";
import { selectData, updateData } from "../../slices/dataSlice/dataSlice";
import { selectActiveTab, selectEditMe, updateEditMe } from "../../slices/crud/crudSlice";
import { selectUnSavableNodes, updateUnSavableNodes } from "../../slices/save/saveSlice";
import useUnlayeredChilds from "../common/useUnlayeredChilds";
import { calculateMaxMember_ofLayer, findLayer, getInter_NonInter_members } from "../../utils/utilities";
import { selectSelectedNodes, updateSelectedNodes } from "../../slices/flowSlice/flowSlice";
import useRecalculateSelectedNodes from "../useRecalculateSelectedNodes/useRecalculateSelectedNodes";
import { CHILDS, EDITME, INTERPARENTS, LAYER, LAYER1, MEMBEROF, PARENTS } from "../../../../constants/constants";

function useCreateNode() {
    const dispatch = useDispatch();
    const unSavableNodes = useSelector(selectUnSavableNodes);
    const recalculateSelectedNodes = useRecalculateSelectedNodes();
    const { addToUnlayeredChilds } = useUnlayeredChilds();
    var dataJson = { ...useSelector(selectData) };
    const towername = useSelector(selectActiveTab);
    var tower_dataJson = { ...dataJson[towername] };
    var editMe = [...useSelector(selectEditMe)];

    var selectedNodes = useSelector(selectSelectedNodes);

    function createNode(nodename, nodedata, Nodeindex = -1) {
        if (nodename.includes(EDITME)) {
            nodename = assignUniqueName(nodename);
        }

        if (!nodedata) nodedata = "{}";

        console.log("30", "node data = ", nodedata);
        updatetower_dataJson(nodename, JSON.parse(nodedata), Nodeindex);
        selectedNodes = {
            ...recalculateSelectedNodes(selectedNodes, tower_dataJson, false),
        };
        dispatch(updateSelectedNodes(selectedNodes));
        dispatch(updateUnSavableNodes(unSavableNodes + 1));
    }

    //update data of tower_dataJson in redux so that layerwise algorithm didn't need to run again;
    function updatetower_dataJson(nodename, nodedata, Nodeindex) {
        var obj = {
            [CHILDS]: {},
            [PARENTS]: {},
            ...nodedata,
        };

        if (nodedata[MEMBEROF]) {
            //this will give us the inter tower and non-inter tower seperated member_of
            var { inter_mem, non_inter_member_of } = getInter_NonInter_members(nodedata[MEMBEROF]);

            //creating layerwise parents that will be stored in dataJson
            obj[PARENTS] = updateParents(non_inter_member_of, tower_dataJson);

            //updating data for inter-tower members
            if (inter_mem.length > 0) {
                obj[INTERPARENTS] = updateInterTowerMembers(inter_mem, nodename, dataJson);
            }

            //iterate through the all member_of to find max layer so that new node can be created into next layer
            // calculating max layer out of all member_of to create node in next layer of max layer
            var max = calculateMaxMember_ofLayer(non_inter_member_of, tower_dataJson) + 1;

            var nodelayer = max;

            //insert this new node entry to the childs section of it parents
            addToParentChilds(nodename, nodelayer, obj[PARENTS], tower_dataJson);

            //add node itself in the data json
            if (tower_dataJson[nodelayer]) {
                if (Nodeindex == -1) {
                    tower_dataJson[nodelayer] = {
                        ...tower_dataJson[nodelayer],
                        [nodename]: { ...obj },
                    };
                } else {
                    //this part will be invoked if a childNode is created so this would create nodes at the same index or y-position as of parent
                    insertNodeAtGivenIndex(nodename, Nodeindex, nodelayer, tower_dataJson, obj);
                }
            } else {
                tower_dataJson[nodelayer] = { [nodename]: { ...obj } };
            }
        } else {
            //case when a new user Group is created
            if (!tower_dataJson[LAYER1]) {
                tower_dataJson[LAYER1] = {};
            }
            tower_dataJson[LAYER1] = {
                ...tower_dataJson[LAYER1],
                [nodename]: { ...obj },
            };
        }
        // add obj to the data itself

        //update data Json on redux
        dataJson[towername] = { ...tower_dataJson };
        dispatch(updateData({ ...dataJson }));
    }

    function addToParentChilds(nodename, nodelayer, parents, tower_dataJson) {
        for (let layer in parents) {
            for (let j = 0; j < parents[layer].length; j++) {
                let layerData = { ...tower_dataJson[layer] };
                let nodeData = { ...layerData[parents[layer][j]] };
                let nodechilds = { ...nodeData[CHILDS] };
                if (nodechilds[nodelayer]) {
                    nodechilds[nodelayer] = [...nodechilds[nodelayer], nodename];
                } else {
                    nodechilds[nodelayer] = [nodename];
                }

                nodeData[CHILDS] = { ...nodechilds };
                layerData[parents[layer][j]] = { ...nodeData };
                tower_dataJson[layer] = { ...layerData };
            }
        }
    }

    function updateParents(non_inter_member_of, tower_dataJson) {
        var parents = {};
        for (let i = 0; i < non_inter_member_of.length; i++) {
            var mem_layer = findLayer(non_inter_member_of[i], tower_dataJson);
            parents[mem_layer] = parents[mem_layer]
                ? [...parents[mem_layer], non_inter_member_of[i]]
                : [non_inter_member_of[i]];
        }
        return parents;
    }

    function insertNodeAtGivenIndex(nodename, Nodeindex, nodelayer, tower_dataJson, obj) {
        let layerdata = { ...tower_dataJson[nodelayer] };
        let newLayerdata = {};
        let policies = Object.keys(tower_dataJson[nodelayer]);
        let isInserted = 0;
        for (let i = 0; i < policies.length; i++) {
            if (Nodeindex === i) {
                isInserted = 1;
                newLayerdata[nodename] = { ...obj };
            }
            newLayerdata[policies[i]] = { ...layerdata[policies[i]] };
        }
        if (isInserted === 0) {
            newLayerdata[nodename] = { ...obj };
        }
        tower_dataJson[nodelayer] = { ...newLayerdata };
    }

    function updateInterTowerMembers(inter_mem, nodename, dataJson) {
        for (let x = 0; x < inter_mem.length; x++) {
            dataJson = {
                ...addToUnlayeredChilds(inter_mem[x], nodename, towername, dataJson),
            };
        }
        //returning to just confirm this function is done
        return inter_mem;
    }

    //this function generaates numbers for Edit-Me policy just like windows do with newfolder names
    function assignUniqueName(nodeName) {
        var id = 0;

        //it will find the missing id and assign the new node this id
        for (let x = 0; x < editMe.length; x++) {
            if (editMe[x] !== x) {
                id = x;
                break;
            }
            if (x == editMe.length - 1) {
                id = x + 1;
            }
        }

        editMe = [...editMe.slice(0, id), id, ...editMe.slice(id, editMe.length)];
        dispatch(updateEditMe(editMe));

        if (id == 0) return nodeName;
        else return nodeName + `(${id})`;
    }

    return createNode;
}

export default useCreateNode;
