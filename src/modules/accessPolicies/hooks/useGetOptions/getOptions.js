import { useSelector } from "react-redux";
import { selectData } from "../../slices/dataSlice/dataSlice";
import { selectActiveTab } from "../../slices/crud/crudSlice";
import { CHILDS, FILTER, INTERPARENTS, MASKS, PIIVISIBILITY, PREEDIT } from "../../../../constants/constants";

function useGetOptions() {
    const dataJson = useSelector(selectData);

    const activeTower = useSelector(selectActiveTab);
    const tower_dataJson = dataJson[activeTower];
    const notIncludePolicies = new Set();

    function getOptions(policyLayer, policyName) {
        // console.log("first point reached in getoptions");
        var options = [];
        notIncludePolicies.add(policyName);

        addAllChilds(policyLayer, policyName);

        for (let layer in tower_dataJson) {
            if (layer != MASKS && layer != FILTER && layer != PIIVISIBILITY && layer != PREEDIT) {
                for (let name in tower_dataJson[layer]) {
                    //added second condition to not allow inter-tower policies in options
                    if (!notIncludePolicies.has(name) && !tower_dataJson[layer][name][INTERPARENTS]) {
                        options.push(name);
                    }
                }
            }
        }
        return options;
    }

    function addAllChilds(policyLayer, name) {
        //add all the childs to set

        for (let layer in tower_dataJson[policyLayer][name][CHILDS]) {
            if (layer != MASKS && layer != FILTER && layer != PIIVISIBILITY && layer != PREEDIT) {
                var childs = tower_dataJson[policyLayer][name][CHILDS][layer];
                for (let i = 0; i < childs.length; i++) {
                    notIncludePolicies.add(childs[i]);
                    addAllChilds(layer, childs[i]);
                }
            }
        }
    }

    //this below function is only used for displaying the nodes as options in searchbox for a specific tower
    function getAllPolicyNames() {
        var options = [];
        for (let key in dataJson[activeTower]) {
            if (key != PREEDIT && key != MASKS && key != FILTER && key != PIIVISIBILITY) {
                var layerPolicies = [];
                layerPolicies = Object.keys(dataJson[activeTower][key]);

                options = [
                    ...options,
                    ...layerPolicies.map((policy) => {
                        return { label: policy, layer: key };
                    }),
                ];
            }
        }

        return options;
    }

    return { getOptions, getAllPolicyNames };
}

export default useGetOptions;
