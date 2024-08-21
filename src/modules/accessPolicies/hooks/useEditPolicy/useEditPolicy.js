import { useDispatch, useSelector } from "react-redux";
import {
    selectData,
    selectSplitViewData,
    selectUniqueNodeNames,
    updateData,
    updateSplitViewData,
} from "../../slices/dataSlice/dataSlice";
import { selectActiveTab, selectEditMe, updateEditModalData, updateEditMe } from "../../slices/crud/crudSlice";
import { selectUnSavableNodes, updateUnSavableNodes } from "../../slices/save/saveSlice";
import useSetUnique from "../useSetUnique/useSetUnique";

import useUnlayeredChilds from "../common/useUnlayeredChilds";
import {
    extractNumber,
    findLayer,
    getInter_NonInter_members,
    getTowerNameFromTowerId,
    removeFromEditMe,
} from "../../utils/utilities";
import { getLayersOfTower } from "../../utils/utilities";
import { selectSelectedNodes, updateSelectedNodes } from "../../slices/flowSlice/flowSlice";
import useRecalculateSelectedNodes from "../useRecalculateSelectedNodes/useRecalculateSelectedNodes";
import {
    CHILDS,
    EDITME,
    FILTER,
    INTERPARENTS,
    MASKS,
    MEMBEROF,
    NAME,
    PARENTS,
    PIIVISIBILITY,
    PREEDIT,
    TOWERS,
    UNLAYEREDCHILDS,
} from "../../../../constants/constants";

function useEditPolicy() {
    //
    //
    //
    const dispatch = useDispatch();
    let unSavableNodes = useSelector(selectUnSavableNodes);
    var dataJson = { ...useSelector(selectData) };
    var activeTower = useSelector(selectActiveTab);
    var tower_dataJson = { ...dataJson[activeTower] };
    var traversedPolicies = [];
    var layers = [];
    const { deleteFromUnlayeredChilds, addToUnlayeredChilds } = useUnlayeredChilds();
    const setUnique = useSetUnique();
    let uniqueNodeNames = useSelector(selectUniqueNodeNames);
    var editMe = [...useSelector(selectEditMe)];
    let selectedNodes = { ...useSelector(selectSelectedNodes) };
    let splitViewData = { ...useSelector(selectSplitViewData) };
    let recalculateSelectedNodes = useRecalculateSelectedNodes();

    //
    //
    //
    //
    //
    //
    //
    /**
     * Main function to edit a policy, update related nodes, and manage state.
     *
     * @param {string} layer - The layer of the policy.
     * @param {string} oldName - The current name of the policy.
     * @param {string} name - The new name for the policy.
     * @param {Array} member_of - The member_of list for the policy.
     * @param {Array} pii_visibility - The PII visibility list for the policy.
     * @param {string|null} filter - The filter for the policy (optional).
     * @param {string|null} mask - The mask for the policy (optional).
     * @param {boolean} split - Whether the view is split.
     */
    function editPolicy(layer, oldName, name, member_of, pii_visibility, filter = null, mask = null, split) {
        console.log("before the eidt json the dataJson", dataJson);
        traversedPolicies = [];

        let newPolicyData = createNewPolicyData(member_of, pii_visibility, filter, mask);
        layers = getLayersOfTower(tower_dataJson);

        var old_inter = getOldInterParents(tower_dataJson, layer, oldName);

        let editedPolicyData = updatePolicyData(oldName, layer, newPolicyData);
        updateTowerDataJson(layer, oldName, editedPolicyData);

        //updating the member_of if new name is different from old and placing it in inter section also if any inter tower has been changed
        if (oldName != name) {
            tower_dataJson = handlePolicyRename(oldName, name, layer, tower_dataJson, dataJson, editMe);
        }

        //filtering the member_of inter and non inter
        const { non_inter_member_of, inter_mem } = getInter_NonInter_members(member_of);

        updateTowerDataJsonInterPart(layer, name, inter_mem);

        updateParentsSection(oldName, name, layer, non_inter_member_of, old_inter, inter_mem);
        //for updating selectedNodes if required

        recursiveFunc(layer, name);

        dataJson[activeTower] = { ...tower_dataJson };

        updateUnlayeredChilds(old_inter, inter_mem, name);

        console.log("after the edit dataJson", dataJson);
        updateState();

        /// split view work from here
        let newEditedObj;
        for (let layers in dataJson[activeTower]) {
            for (let layer in dataJson[activeTower][layers]) {
                if (layer === name) {
                    newEditedObj = { ...dataJson[activeTower][layers][layer] };
                    newEditedObj["type"] = "node";
                    newEditedObj["policyName"] = name;
                    newEditedObj["policyLayer"] = layers;

                    splitViewData = { ...splitViewData, [name]: { ...newEditedObj } };
                }
            }
            if (oldName !== name) {
                delete splitViewData[oldName];
            }
            if (!split) {
                dispatch(updateEditModalData(newEditedObj));
            }
        }

        console.log("132 after edit splitViewData = ", splitViewData);
        splitViewData = {
            ...recalculateSelectedNodes(splitViewData, tower_dataJson, true),
        };

        dispatch(updateSplitViewData(splitViewData));

        //maintaining names list
        setUnique(uniqueNodeNames, oldName, name, "node");

        //the below condition maintain the record for unsavable name of nodes
        if (!name.includes("--EDIT-ME--") && oldName.includes("--EDIT-ME--")) {
            dispatch(updateUnSavableNodes(unSavableNodes - 1));
        }
    }

    // editpolicy function ends here
    //
    //
    //
    //
    //
    //
    //
    //
    //

    //
    /**
     * Creates a new policy data object.
     */
    function createNewPolicyData(member_of, pii_visibility, filter, mask) {
        return {
            [MEMBEROF]: member_of,
            [PIIVISIBILITY]: pii_visibility,
            [FILTER]: filter,
            [MASKS]: mask,
        };
    }

    //
    //
    //
    /**
     * Retrieves the old inter parents.
     */
    function getOldInterParents(tower_dataJson, layer, oldName) {
        return tower_dataJson[layer][oldName][INTERPARENTS] ? [...tower_dataJson[layer][oldName][INTERPARENTS]] : [];
    }

    //
    //
    //
    //
    //
    /**
     * Updates the tower data JSON with the edited policy data.
     */
    function updateTowerDataJson(layer, oldName, editedPolicyData) {
        tower_dataJson[layer] = {
            ...tower_dataJson[layer],
            [oldName]: { ...editedPolicyData },
        };
    }

    ///
    //
    //
    //
    //
    //

    /**
     * Updates the tower data JSON inter part.
     */
    function updateTowerDataJsonInterPart(layer, name, inter_mem) {
        let tempLayerData = { ...tower_dataJson[layer] };
        let tempNodedata = { ...tempLayerData[name] };
        if (inter_mem.length > 0) {
            tempNodedata = { ...tempNodedata, inter: [...inter_mem] };
        } else {
            if (tempNodedata[INTERPARENTS]) {
                delete tempNodedata[INTERPARENTS];
            }
        }

        tempLayerData = {
            ...tempLayerData,
            [name]: { ...tempNodedata },
        };

        tower_dataJson[layer] = tempLayerData;
    }

    //
    //
    //
    //
    //
    /**
     * Updates the parents section of the node.
     */
    function updateParentsSection(oldName, name, layer, non_inter_member_of, old_inter, inter_mem) {
        const layerdata = { ...tower_dataJson[layer] };
        const nodedata = { ...layerdata[name] };
        const oldParents = { ...nodedata.parents };
        const newParents = caculateNewParents(non_inter_member_of);

        updateChildsInParents(oldParents, newParents, name, layer);

        nodedata.parents = { ...newParents };
        tower_dataJson[layer] = { ...layerdata, [name]: { ...nodedata } };
    }

    //
    //

    /**
     * Updates the children in parents nodes.
     */
    function updateChildsInParents(oldParents, newParents, name, layer) {
        for (let layr in oldParents) {
            let newArr = newParents[layr] || [];
            const arr = oldParents[layr];
            for (let i = 0; i < arr.length; i++) {
                if (!newArr.includes(arr[i])) {
                    tower_dataJson = removeFromParentChild(tower_dataJson, layr, arr[i], name, layer);
                }
            }
        }
    }

    //
    //
    //
    //
    /**
     * Updates the unlayered children nodes.
     */
    function updateUnlayeredChilds(old_inter, inter_mem, name) {
        for (let x = 0; x < old_inter.length; x++) {
            if (!inter_mem.includes(old_inter[x])) {
                dataJson = {
                    ...deleteFromUnlayeredChilds(old_inter[x], name, activeTower, dataJson),
                };
            }
        }

        for (let x = 0; x < inter_mem.length; x++) {
            if (!old_inter.includes(inter_mem[x])) {
                dataJson = {
                    ...addToUnlayeredChilds(inter_mem[x], name, activeTower, dataJson),
                };
            }
        }
    }

    //
    //
    //
    //
    /**
     * Updates the state using Redux dispatch.
     */
    function updateState() {
        selectedNodes = {
            ...recalculateSelectedNodes(selectedNodes, tower_dataJson, false),
        };
        dispatch(updateData(dataJson));
        dispatch(updateSelectedNodes(selectedNodes));
    }
    //
    //
    /**
     * Retrieves the new edited object.
     */
    function getNewEditedObj(name) {
        let newEditedObj;

        for (let layers in dataJson[activeTower]) {
            for (let layer in dataJson[activeTower][layers]) {
                if (layer === name) {
                    newEditedObj = { ...dataJson[activeTower][layers][layer] };
                    newEditedObj["type"] = "node";
                    newEditedObj["policyName"] = name;
                    newEditedObj["policyLayer"] = layers;

                    splitViewData = { ...splitViewData, [name]: { ...newEditedObj } };
                }
            }
            if (oldName !== name) {
                delete splitViewData[oldName];
            }
        }

        return newEditedObj;
    }
    //
    //
    //
    /**
     * This function handles the renaming logic for a policy node, including updating references in various parent and child lists.
     *
     * @param {string} oldName - The old name of the policy.
     * @param {string} newName - The new name of the policy.
     * @param {string} layer - The layer of the policy.
     * @param {Object} towerData - The JSON object representing the tower data.
     * @param {Object} dataJson - The JSON object representing the overall data.
     * @param {Array} editMe - The array representing the Edit-Me list in Redux.
     * @param {Function} dispatch - The Redux dispatch function.
     * @returns {Object} - The updated tower data JSON object.
     */
    function handlePolicyRename(oldName, newName, layer, towerData, dataJson, editMe) {
        // Check if the old name includes EDITME and remove the unique number from EditMe Redux
        if (oldName.includes(EDITME)) {
            const num = extractNumber(oldName);
            editMe = [...removeFromEditMe(editMe, num)];
            dispatch(updateEditMe(editMe));
        }

        // Update childs and unlayered childs member_of and inter
        towerData = updateNameinChildsMember_of(oldName, newName, layer, towerData);
        const unlayeredChilds = towerData[layer][oldName][UNLAYEREDCHILDS] || [];
        dataJson = updateNameinInterChildsMember_of(oldName, unlayeredChilds, newName, dataJson);
        dataJson = updateNameinInterParents(dataJson, layer, oldName, newName);

        // Calculate new parents Object
        const layerData = towerData[layer];
        const nodeData = { ...layerData[oldName] };
        const newLayerData = Object.keys(layerData).reduce((acc, policy) => {
            acc[policy === oldName ? newName : policy] = layerData[policy];
            return acc;
        }, {});

        towerData = { ...towerData, [layer]: { ...newLayerData } };
        const parents = nodeData[PARENTS];
        const childs = nodeData[CHILDS];

        // Update name in parent-child relationships
        towerData = updateNameinParentChilds(oldName, newName, towerData, parents, layer);
        towerData = updateNameinChildParents(oldName, newName, towerData, childs, layer);

        // Update node name in selectedNodes if present
        renameInSelectedNodes(oldName, newName);

        return towerData;
    }

    //
    //
    //
    //
    //
    //
    //this function edits or modify the selectedNodes data if edited Nodes is present
    function renameInSelectedNodes(oldName, newName) {
        if (selectedNodes[oldName]) {
            let selectedNodeData = selectedNodes[oldName];
            if (oldName != newName) {
                delete selectedNodes[oldName];
                selectedNodes[newName] = selectedNodeData;
            }
        }
    }

    function modifySelectedNodes(newName, newLayer) {
        if (selectedNodes[newName]) {
            let selectedNodeData = selectedNodes[newName];
            //updating the name and layer in selectedNodes

            //updating layer in selectedNodes
            selectedNodes[newName] = { ...selectedNodeData, policyLayer: newLayer };
        }
    }

    function modifySplitView(newName, newLayer) {
        if (splitViewData[newName]) {
            let splitViewNodeData = splitViewData[newName];
            //updating the name and layer in splitViewData

            //updating layer in splitViewData
            splitViewData[newName] = { ...splitViewNodeData, policyLayer: newLayer };
        }
    }

    // here we are having all the functions defined

    //wrote this funnc to get the layers number in sorted order
    function findLayerNumber(nodename) {
        //this part of code need to be reduced
        for (let i = 0; i < layers.length; i++) {
            var layerNodes = Object.keys(tower_dataJson[layers[i]]);
            if (layerNodes.includes(nodename)) {
                return i + 1;
            }
        }
        return 0;
    }

    function removeFromParentChild(tower_dataJson, layr, parentName, name, layer) {
        let parentlayerdata = { ...tower_dataJson[layr] };
        let parentnodedata = { ...parentlayerdata[parentName] };
        let parentchilds = { ...parentnodedata.childs };

        let parentindex = parentchilds[layer].indexOf(name);
        let arra = [...parentchilds[layer]];
        arra.splice(parentindex, 1);
        if (arra.length != 0) {
            parentchilds = { ...parentchilds, [layer]: [...arra] };
        } else {
            delete parentchilds[layer];
        }

        //now saving it back
        parentnodedata = { ...parentnodedata, childs: { ...parentchilds } };
        parentlayerdata = {
            ...parentlayerdata,
            [parentName]: { ...parentnodedata },
        };
        tower_dataJson = {
            ...tower_dataJson,
            [layr]: { ...parentlayerdata },
        };
        return tower_dataJson;
    }

    /**
     * This function updates the name of a parent policy in the child policies' parents lists.
     * It traverses through the children layers, finds the references to the old name, and updates them with the new name.
     *
     * @param {string} oldName - The old name of the parent policy.
     * @param {string} newName - The new name of the parent policy.
     * @param {Object} tower_dataJson - The JSON object representing the tower data.
     * @param {Object} childs - An object where keys are child layers and values are arrays of child policy names.
     * @param {string} layer - The layer of the parent policy being updated.
     * @returns {Object} - The updated tower data JSON object.
     */
    function updateNameinChildParents(oldName, newName, tower_dataJson, childs, layer) {
        // Iterate over each child layer
        for (const childLayer in childs) {
            const childNames = childs[childLayer];

            // Iterate over each child policy in the current layer
            childNames.forEach((childName) => {
                const childLayerData = { ...tower_dataJson[childLayer] };
                const childData = { ...childLayerData[childName] };
                const parentData = { ...childData[PARENTS] };

                // Find the index of the old name in the parent data
                const parentIndex = parentData[layer].indexOf(oldName);
                if (parentIndex !== -1) {
                    const updatedParents = [...parentData[layer]];
                    updatedParents[parentIndex] = newName;

                    // Update the parent data with the new name
                    parentData[layer] = updatedParents;
                    childData[PARENTS] = parentData;
                    childLayerData[childName] = childData;
                    tower_dataJson[childLayer] = childLayerData;
                }
            });
        }

        return tower_dataJson;
    }

    //
    //
    //
    /**
     * This function updates the name of a child policy in the parent policies' child lists.
     * It traverses through the parents' layers, finds the child policy by its old name,
     * and updates it with the new name.
     *
     * @param {string} oldName - The old name of the child policy.
     * @param {string} newName - The new name of the child policy.
     * @param {Object} towerData - The JSON object representing the tower data.
     * @param {Object} parents - An object where keys are parent layers and values are arrays of parent policy names.
     * @param {string} layer - The layer of the child policy being updated.
     * @returns {Object} - The updated tower data JSON object.
     */
    function updateNameinParentChilds(oldName, newName, tower_dataJson, parents, layer) {
        // Iterate over each parent layer and update child data
        for (const parentLayer in parents) {
            const parentNames = parents[parentLayer];
            parentNames.forEach((parentName) => {
                updateChildData(parentLayer, parentName);
            });
        }

        // Helper function to update child's name in parent's child data
        function updateChildData(parentLayer, parentName) {
            const parentLayerData = { ...tower_dataJson[parentLayer] };
            const parentData = { ...parentLayerData[parentName] };
            const childData = { ...parentData.childs };

            if (childData[layer]) {
                const childIndex = childData[layer].indexOf(oldName);
                if (childIndex !== -1) {
                    let updatedChilds = [...childData[layer]];
                    updatedChilds[childIndex] = newName;
                    childData[layer] = updatedChilds;
                }
            }

            parentData[CHILDS] = childData;
            parentLayerData[parentName] = parentData;
            tower_dataJson[parentLayer] = parentLayerData;
        }

        return tower_dataJson;
    }

    //This function replaces the old name with new name in all children's member_of
    function updateNameinChildsMember_of(oldName, newName, layer, tower_dataJson) {
        let childData = tower_dataJson[layer][oldName][CHILDS];
        //updating childs member_of
        for (let children_layer in childData) {
            let children = childData[children_layer];
            for (let x = 0; x < children.length; x++) {
                let childrenData = { ...tower_dataJson[children_layer][children[x]] };

                //replacing old name with new name
                let mems = [...childrenData[MEMBEROF]];
                let index = mems.indexOf(oldName);
                mems[index] = newName;

                // updating children's memberof
                childrenData[MEMBEROF] = mems;

                //updating into the towerDataJson
                tower_dataJson[children_layer] = {
                    ...tower_dataJson[children_layer],
                    [children[x]]: childrenData,
                };
            }
        }
        return tower_dataJson;
    }

    //
    //
    //
    /**
     * This function updates the name of a child policy in its inter-parents' unlayered child lists.
     * It deletes the old name from the unlayered child lists of inter-parents and adds the new name.
     *
     * @param {Object} dataJson - The JSON object representing the tower data.
     * @param {string} layer - The layer of the child policy being updated.
     * @param {string} oldName - The old name of the child policy.
     * @param {string} newName - The new name of the child policy.
     * @returns {Object} - The updated tower data JSON object.
     */
    function updateNameinInterParents(dataJson, layer, oldName, name) {
        const interParents = dataJson[activeTower][layer][oldName][INTERPARENTS];

        // Check if there are inter-parents to update
        if (interParents) {
            // Iterate over each inter-parent and update the unlayered childs
            interParents.forEach((parent) => {
                dataJson = {
                    ...deleteFromUnlayeredChilds(parent, oldName, activeTower, dataJson),
                };
                dataJson = {
                    ...addToUnlayeredChilds(parent, newName, activeTower, dataJson),
                };
            });
        }

        return dataJson;
    }

    //
    //
    //
    //
    //
    //
    /**
     * This function updates the name of a policy in the inter-tower child policies' member_of and inter_parents lists.
     * It traverses through the unlayered child policies, finds the references to the old name, and updates them with the new name.
     *
     * @param {string} oldName - The old name of the policy.
     * @param {Array} unlayered_childs - An array of unlayered child policy references.
     * @param {string} newName - The new name of the policy.
     * @param {Object} dataJson - The JSON object representing the tower data.
     * @returns {Object} - The updated tower data JSON object.
     */
    function updateNameinInterChildsMember_of(oldName, unlayered_childs, newName, dataJson) {
        // Helper function to update members or inter_parents lists
        function getUpdatedInterMembers(members, oldName, newName, tower) {
            const memberIndex = members.indexOf(`${tower}:${oldName}`);
            if (memberIndex !== -1) {
                members[memberIndex] = `${tower}:${newName}`;
            }
            return members;
        }

        // Iterate over each unlayered child policy
        for (const unlayeredChild of unlayered_childs) {
            let [childrenPolicy_tower_id, childPolicy_name] = unlayeredChild.split(":");

            let childTowerName = getTowerNameFromTowerId(dataJson[TOWERS], childrenPolicy_tower_id);

            let childTowerData = { ...dataJson[childTowerName] };
            let policy_layer = findLayer(childPolicy_name, childTowerData);
            let policyData = { ...childTowerData[policy_layer][childPolicy_name] };
            let activeTowerID = dataJson[TOWERS][activeTower];

            const updatedMembers = getUpdatedInterMembers([...policyData[MEMBEROF]], oldName, newName, activeTowerID);
            const updatedInterParents = getUpdatedInterMembers(
                [...policyData[INTERPARENTS]],
                oldName,
                newName,
                activeTowerID
            );

            //updating the inter-tower chidrenData with new name
            const updatedPolicyData = {
                ...policyData,
                [MEMBEROF]: updatedMembers,
                [INTERPARENTS]: updatedInterParents,
            };

            //now updating the member_of and inter into towerData
            childTowerData[policy_layer] = {
                ...childTowerData[policy_layer],
                [childPolicy_name]: updatedPolicyData,
            };

            //updating towerdata to dataJson
            dataJson[childTowerName] = { ...childTowerData };
        }
        return dataJson;
    }

    //
    //
    //
    //
    //
    /**
     * This function updates the policy data with the provided edited data.
     * It also maintains a record of the previous policy data for comparison purposes.
     *
     * @param {string} oldName - The old name of the policy.
     * @param {string} layer - The layer in the tower data JSON.
     * @param {Object} editedData - The edited data to update the policy with.
     * @returns {Object} - The updated policy data.
     */
    function updatePolicyData(oldName, layer, editedData) {
        let { filter, masks, member_of, pii_visibility } = editedData;

        let policyData = { ...tower_dataJson[layer][oldName] };

        // Record of old data for comparison purposes (diff)
        if (!policyData[PREEDIT]) {
            policyData[PREEDIT] = {
                [NAME]: oldName,
                [PIIVISIBILITY]: policyData.pii_visibility || null,
                [MEMBEROF]: policyData.member_of || null,
                [MASKS]: policyData.masks || null,
                [FILTER]: policyData.filter || null,
            };
        }

        // Update fields with the new values or remove them if the values are invalid
        updateField(policyData, FILTER, filter);
        updateField(policyData, MASKS, masks);
        updateField(policyData, MEMBEROF, member_of);
        updateField(policyData, PIIVISIBILITY, pii_visibility);

        // Helper function to update or remove a field based on its value
        function updateField(policyData, field, value) {
            switch (field) {
                case FILTER:
                case MASKS:
                    {
                        if (value !== "" && value !== null) {
                            policyData[field] = value;
                        } else {
                            delete policyData[field];
                        }
                    }
                    break;
                case MEMBEROF:
                case PIIVISIBILITY:
                    {
                        if (value.length !== 0) {
                            policyData[field] = value;
                        } else {
                            delete policyData[field];
                        }
                    }
                    break;
            }
        }

        return policyData;
    }

    //for calculating new parents
    function caculateNewParents(member_of) {
        var newObj = {};
        for (let i = 0; i < member_of.length; i++) {
            var layer = findLayerNumber(member_of[i]);
            if (newObj[layer]) newObj[layer] = [...newObj[layer], member_of[i]];
            else newObj[layer] = [member_of[i]];
        }

        var newParents = {};
        for (let layerNumber in newObj) {
            newParents[layerNumber] = [...newObj[layerNumber]];
        }
        return newParents;
    }

    //this is the function called for node layer position modification

    function recursiveFunc(layer, name) {
        //find max layer
        let newLayer = findNewLayer(tower_dataJson, layer, name);
        modifySelectedNodes(name, newLayer);
        modifySplitView(name, newLayer);

        traversedPolicies.push(name);

        // It updates the layers array if the new layer is not already included.
        if (!layers.includes(newLayer)) layers.push(newLayer);

        //change nodes position itself in tower_dataJson
        // step1 : adding data to new layer
        updateNodePosition(layer, name, newLayer);

        //update the parent nodes child entry in new layer
        updateParentsNodes(layer, name, newLayer);
        updateChildsNode(layer, name, newLayer);
    }

    // Finding the New Layer:
    // It determines the new layer for the node based on its parent layers. If the node has parents, it calculates the max layer among them and assigns the node to the next layer. Otherwise, it assigns the node to the first layer (layer1).
    function findNewLayer(tower_dataJson, layer, name) {
        var parentLayers = Object.keys(tower_dataJson[layer][name].parents);
        var maxLayer = -1;
        var layerIndex;
        var newLayer;
        if (parentLayers.length !== 0) {
            maxLayer = parentLayers[parentLayers.length - 1];
            layerIndex = layers.indexOf(maxLayer);
            newLayer = layerIndex + 2;
        } else {
            newLayer = 1;
        }
        return newLayer;
    }

    // Moving the Node:
    // It removes the node from its current layer and adds it to the new layer in tower_dataJson.
    function updateNodePosition(layer, name, newLayer) {
        var nodedata = tower_dataJson[layer][name];
        var newlayerdata = { ...tower_dataJson[newLayer] };
        newlayerdata = { ...newlayerdata, [name]: { ...nodedata } };
        var oldlayerdata = { ...tower_dataJson[layer] };
        delete oldlayerdata[name];
        tower_dataJson = {
            ...tower_dataJson,
            [layer]: { ...oldlayerdata },
            [newLayer]: { ...newlayerdata },
        };
    }

    // Updating Parent Nodes:
    // It updates the child entry of the parent nodes in the new layer.
    // For each parent node, it removes the node from its child list in the current layer and adds it to the child list in the new layer.
    function updateParentsNodes(layer, name, newLayer) {
        let parents = tower_dataJson[newLayer][name].parents;
        for (let parentlayer in parents) {
            let layerparentNames = parents[parentlayer];
            for (let j = 0; j < layerparentNames.length; j++) {
                //updating parents childs
                let layerdata = { ...tower_dataJson[parentlayer] };
                let nodedata = { ...layerdata[layerparentNames[j]] };
                let childs = { ...nodedata.childs };

                //remove name from layer
                if (childs[layer])
                    if (childs[layer].includes(name)) {
                        if (childs[layer].length !== 1) {
                            let nodeindex = childs[layer].indexOf(name);
                            let arra = [...childs[layer]];
                            arra.splice(nodeindex, 1);
                            childs = { ...childs, [layer]: [...arra] };
                        } else {
                            delete childs[layer];
                        }
                    }

                //add name to newlayer
                if (childs[newLayer]) {
                    childs[newLayer] = [...childs[newLayer], name];
                } else {
                    childs[newLayer] = [name];
                }

                nodedata = { ...nodedata, childs: { ...childs } };
                layerdata = { ...layerdata, [layerparentNames[j]]: { ...nodedata } };
                tower_dataJson = { ...tower_dataJson, [parentlayer]: { ...layerdata } };
            }
        }
    }

    // Updating Child Nodes:
    // If the new layer is different from the current layer, it updates the parent entry of the node's children.
    // For each child node, it removes the node from its parent list in the current layer and adds it to the parent list in the new layer.
    // It recursively calls recursiveFunc for each child node to update their positions if they haven't been visited before.
    function updateChildsNode(layer, name, newLayer) {
        if (newLayer !== layer) {
            //now updating childs parents
            let childs = tower_dataJson[newLayer][name].childs;
            for (let childlayer in childs) {
                var layerchildNodes = childs[childlayer];
                for (let j = 0; j < layerchildNodes.length; j++) {
                    tower_dataJson = updateChildNodeParent(
                        childlayer,
                        name,
                        layerchildNodes[j],
                        layer,
                        tower_dataJson,
                        newLayer
                    );
                }
            }

            for (let childlayer in tower_dataJson[newLayer][name].childs) {
                var layerchildNodes = childs[childlayer];
                for (let j = 0; j < layerchildNodes.length; j++) {
                    if (!traversedPolicies.includes(layerchildNodes[j])) recursiveFunc(childlayer, layerchildNodes[j]);
                }
            }
        }

        if (Object.keys(tower_dataJson[layer]).length == 0) {
            delete tower_dataJson[layer];
            let layerIndex = layers.indexOf(layer);
            layers.splice(layerIndex, 1);
        }
    }

    function updateChildNodeParent(childlayer, name, layerchildNode, layer, tower_dataJson, newLayer) {
        let layerdata = { ...tower_dataJson[childlayer] };
        let nodedata = { ...layerdata[layerchildNode] };
        let parentsdata = { ...nodedata.parents };

        //remove nodename
        if (parentsdata[layer]) {
            if (parentsdata[layer].includes(name)) {
                if (parentsdata[layer].length !== 1) {
                    let index = parentsdata[layer].indexOf(name);
                    let arra = [...parentsdata[layer]];
                    arra.splice(index, 1);
                    parentsdata = { ...parentsdata, [layer]: [...arra] };
                } else {
                    delete parentsdata[layer];
                }
            }
        }

        //add nodename
        if (parentsdata[newLayer]) {
            parentsdata[newLayer] = [...parentsdata[newLayer], name];
        } else {
            let newLayerIndex = layers.indexOf(newLayer);
            let newParentsData = {};
            let flag1 = 0;
            var tempLayers = Object.keys(parentsdata);
            if (tempLayers.length !== 0) {
                for (let tempLayer in parentsdata) {
                    if (layers.indexOf(tempLayer) > newLayerIndex && flag1 !== 1) {
                        newParentsData[newLayer] = [name];
                        newParentsData[tempLayer] = [...parentsdata[tempLayer]];
                        flag1 = 1;
                    } else {
                        newParentsData[tempLayer] = [...parentsdata[tempLayer]];
                    }
                }
                if (flag1 !== 1) {
                    newParentsData[newLayer] = [name];
                }
                parentsdata = { ...newParentsData };
            } else {
                parentsdata[newLayer] = [name];
            }
        }

        nodedata = { ...nodedata, parents: { ...parentsdata } };
        layerdata = { ...layerdata, [layerchildNode]: { ...nodedata } };
        tower_dataJson = {
            ...tower_dataJson,
            [childlayer]: { ...layerdata },
        };

        return tower_dataJson;
    }

    return editPolicy;
}

export default useEditPolicy;
