import { useDispatch, useSelector } from "react-redux";
import { selectSelectedNodes, updateSelectedNodes } from "../../slices/flowSlice/flowSlice";
import { selectData } from "../../slices/dataSlice/dataSlice";
import { selectActiveTab } from "../../slices/crud/crudSlice";
import { CHILDS, MEMBEROF, PARENTS, PII, PIIVISIBILITY } from "../../../../constants/constants";
function useHandleClick() {
    const dispatch = useDispatch();
    const activeTower = useSelector(selectActiveTab);
    const tower_dataJson = useSelector(selectData)[activeTower];
    var selectedNodes = { ...useSelector(selectSelectedNodes) };
    var parentsNodes = {};
    var childsNodes = {};

    function handleClick(nodename, layer) {
        selectedNodes = {
            ...selectOrUnselect(nodename, layer, selectedNodes, tower_dataJson, false),
        };

        //updating the updated selectedNode into redux
        dispatch(updateSelectedNodes(selectedNodes));
    }

    function selectOrUnselect(nodename, layer, selectedNodes, tower_dataJson, split) {
        parentsNodes = {};
        childsNodes = {};

        if (!selectedNodes[nodename]) {
            // getting all parents recursive

            if (!split) {
                getConnectionNodes(nodename, layer, PARENTS, parentsNodes, tower_dataJson);
                // getting all childs
                getConnectionNodes(nodename, layer, CHILDS, childsNodes, tower_dataJson);

                //converting set to array because storing set in redux is not recommended
                parentsNodes = Object.fromEntries(
                    Object.entries(parentsNodes).map(([key, value]) => [key, Array.from(value)])
                );

                //just converting set to array because storing set in redux is not recommended
                childsNodes = Object.fromEntries(
                    Object.entries(childsNodes).map(([key, value]) => [key, Array.from(value)])
                );
            }

            //updating selected policy and adding connected policies as value
            selectedNodes = {
                ...selectedNodes,
                [nodename]: {
                    policyLayer: layer,
                    ...(!split && { parentsNodes: { ...parentsNodes } }),
                    ...(!split && { childsNodes: { ...childsNodes } }),
                    policyName: nodename,
                    type: "node",
                    ...(tower_dataJson[layer][nodename]?.[PARENTS] && {
                        [PARENTS]: tower_dataJson[layer][nodename]?.[PARENTS],
                    }),
                    ...(tower_dataJson[layer][nodename]?.[CHILDS] && {
                        [CHILDS]: tower_dataJson[layer][nodename]?.[CHILDS],
                    }),
                    ...(tower_dataJson[layer][nodename]?.[PIIVISIBILITY] && {
                        [PIIVISIBILITY]: tower_dataJson[layer][nodename]?.[PIIVISIBILITY],
                    }),
                    ...(tower_dataJson[layer][nodename]?.[MEMBEROF] && {
                        [MEMBEROF]: tower_dataJson[layer][nodename]?.[MEMBEROF],
                    }),
                },
            };
        } else {
            //deleting selected polciy and its red data

            delete selectedNodes[nodename];
        }

        return selectedNodes;
    }
    //recursive function to get all the policies in given direction (childs or parents)
    function getConnectionNodes(nodename, layer, direction, displayNodes, towerData) {
        //parents or childs data for the policy

        var connectedPolicyData = towerData[layer][nodename][direction];
        for (let connectionLayer in connectedPolicyData) {
            let connections = connectedPolicyData[connectionLayer];
            if (!displayNodes[connectionLayer]) {
                displayNodes[connectionLayer] = new Set();
            }

            //iterating through connected nodes(childs or parents)
            for (let j = 0; j < connections.length; j++) {
                //now adding those nodes data to the selected nodes json

                displayNodes[connectionLayer].add(connections[j]);

                //recursively calling the function to find all way deep connections
                getConnectionNodes(connections[j], connectionLayer, direction, displayNodes, towerData);
            }
        }
    }

    return { handleClick, selectOrUnselect };
}

export default useHandleClick;
