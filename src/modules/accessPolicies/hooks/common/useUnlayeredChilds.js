//this function handles the unlayered childs removal and addition for inter-tower only
//unlayered_child shows us the relation to inter-tower connection
import { TOWERS, UNLAYEREDCHILDS } from "../../../../constants/constants";
import { findLayer, getTowerNameFromTowerId } from "../../utils/utilities";

function useUnlayeredChilds() {
    //
    function getPolicyData(towerName, policyName, dataJson) {
        const policyLayer = findLayer(policyName, dataJson[towerName]);
        if (policyLayer === "not found") return null;

        const towerData = { ...dataJson[towerName] };
        const layerData = { ...towerData[policyLayer] };
        const policyData = { ...layerData[policyName] };

        return { policyLayer, towerData, layerData, policyData };
    }

    // Helper function to update dataJson
    function updateDataJson(tempTowerName, policyLayer, policyName, policyData, dataJson) {
        const layerData = {
            ...dataJson[tempTowerName][policyLayer],
            [policyName]: policyData,
        };

        dataJson[tempTowerName] = {
            ...dataJson[tempTowerName],
            [policyLayer]: layerData,
        };
        return dataJson;
    }

    function deleteFromUnlayeredChilds(memName, name, tower_name, dataJson) {
        if (memName.includes(":")) {
            let [tempTowerId, policyName] = memName.split(":");

            //getting the towername using TowerId;
            let tempTowerName = getTowerNameFromTowerId(dataJson[TOWERS], tempTowerId);

            //finding policy layer for the inter tower policy
            const result = getPolicyData(tempTowerName, policyName, dataJson);
            if (!result) return dataJson;

            const { policyLayer, towerData, layerData, policyData } = result;

            let towerId = dataJson[TOWERS][tower_name];

            if (policyData[UNLAYEREDCHILDS]) {
                let unlayered_childs = [...policyData[UNLAYEREDCHILDS]];
                let index = unlayered_childs.indexOf(`${towerId}:${name}`);
                if (index != -1) {
                    unlayered_childs.splice(index, 1);

                    if (unlayered_childs.length == 0) {
                        delete policyData[UNLAYEREDCHILDS];
                    } else {
                        policyData[UNLAYEREDCHILDS] = [...unlayered_childs];
                    }

                    dataJson = updateDataJson(tempTowerName, policyLayer, policyName, policyData, dataJson);
                }
            }
        }

        return dataJson;
    }

    //here the functions accepts parameters which is like {2:dmart, here, banking} last 2 params specify from where the inter tower node belongs to
    function addToUnlayeredChilds(memName, name, tower_name, dataJson) {
        if (memName.includes(":")) {
            let [tempTowerId, policyName] = memName.split(":");

            //finding the towername using towerId
            let tempTowerName = getTowerNameFromTowerId(dataJson[TOWERS], tempTowerId);

            var policyLayer = findLayer(policyName, dataJson[tempTowerName]);
            if (policyLayer == "not found") {
                return dataJson;
            }

            //destructuring dataJson for the required part only
            var tower_dataJson = { ...dataJson[tempTowerName] };
            var layerdata = { ...tower_dataJson[policyLayer] };
            var policyData = { ...layerdata[policyName] };

            //updating unlayered_childs if already present else making one
            policyData[UNLAYEREDCHILDS] = (policyData[UNLAYEREDCHILDS] || []).concat(
                `${dataJson[TOWERS][tower_name]}:${name}`
            );

            //now storing the data back to dataJson
            layerdata[policyName] = { ...policyData };
            tower_dataJson[policyLayer] = { ...layerdata };
            dataJson[tempTowerName] = { ...tower_dataJson };
        }
        return dataJson;
    }

    return { deleteFromUnlayeredChilds, addToUnlayeredChilds };
}

export default useUnlayeredChilds;
