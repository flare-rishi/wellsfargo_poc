import {
    CHILDS,
    FILTER,
    INTERPARENTS,
    INTERTOWER,
    LASTIDUSED,
    LAYER,
    MASKS,
    MEMBEROF,
    PARENTS,
    PII,
    PIIVISIBILITY,
    TOWERID,
    TOWERS,
    UNLAYEREDCHILDS,
    VERSIONS,
} from "../../../constants/constants";
import { findLayer } from "../utils/utilities";

const UNORDEREDLISTK = "ul";
const HELPERJSONK = "hl";

function GetDataJson() {
    function algo(rawjson) {
        //writing the algorithm to make data Json with the information
        var dataJson = intializeDataJson(rawjson);
        var helperJson = intializeHelperJson(rawjson);
        var interTower = {};

        //first read each tower and run the algorithm for each tower preserving its ul and helpjson;
        // maintain a seperate json which tells about the dependencies(childs) of inter-tower ex: dmart,etc
        // use reference for those inter-tower nodes which have childs in different towers
        // so first do the read of json towerwise and construct a datajson towerwise for each tower and make inter tower order also
        // now going for each tower
        processTowers(rawjson, dataJson, helperJson, interTower);

        addChildAndParentReferences(dataJson, rawjson, interTower);

        //adding the tower level details of a node like masks filter and member_of
        addTowerDetails(rawjson, dataJson);
        return dataJson;
        // functionality for inter-tower one Json
    }

    //
    //
    //
    //
    //
    function intializeDataJson(rawJson) {
        const dataJson = {};

        for (let key in rawJson) {
            if ([VERSIONS, LASTIDUSED, PII, TOWERS, MASKS, FILTER].includes(key)) {
                dataJson[key] = rawJson[key];
            }
        }

        return dataJson;
    }

    //
    //
    //
    //
    //
    function intializeHelperJson(rawJson) {
        let helperJson = {};

        for (let tower in rawJson[TOWERS]) {
            helperJson[tower] = {
                [UNORDEREDLISTK]: {},
                [HELPERJSONK]: {},
            };
        }

        return helperJson;
    }

    //
    //
    //
    //
    function processTowers(rawjson, dataJson, helperJson, interTower) {
        for (let tower in rawjson[TOWERS]) {
            dataJson[tower] = {};

            for (let key in rawjson[tower]) {
                if (![MASKS, FILTER, PIIVISIBILITY].includes(key)) {
                    var data = [];
                    if (key != INTERTOWER) {
                        data = rawjson[tower][key][MEMBEROF] || [];
                        insertIntoLayer(tower, key, data, rawjson, dataJson, helperJson, interTower);
                    } else {
                        for (let policy in rawjson[tower][INTERTOWER]) {
                            data = rawjson[tower][INTERTOWER][policy][MEMBEROF] || [];
                            insertIntoLayer(tower, policy, data, rawjson, dataJson, helperJson, interTower);
                        }
                    }
                }
            }
        }
    }

    //
    //
    //
    //
    //
    function insertIntoLayer(towerName, policyName, data, rawjson, dataJson, helperJson, interTower) {
        var member_of = transformMemberOf(data, rawjson[TOWERS][towerName], policyName, rawjson, interTower);
        var { max, count, memName } = checkAllMembersInLayer(member_of, towerName, dataJson);
        if (max != -1 || member_of.length == 0) {
            addPolicyToLayer(towerName, policyName, max, dataJson);
            updateHelperJson(towerName, policyName, rawjson, dataJson, helperJson, interTower);
        } else {
            handleUnlayeredPolicies(towerName, policyName, member_of, count, memName, helperJson);
        }
    }

    //
    //
    //
    //
    //this fuction transforms the member_of
    function transformMemberOf(member_of, towerId, policyName, rawjson, interTower) {
        let new_mems = [];

        for (let mem of member_of) {
            if (!mem.includes(":")) {
                new_mems.push(mem);
            } else {
                const [mem_towerId, pol_name] = mem.split(":");

                const mem_tower_name = Object.keys(rawjson[TOWERS]).find((tower) => {
                    rawjson[TOWERS][tower] === mem_towerId;
                });

                if (!interTower[mem_tower_name]) {
                    interTower[mem_tower_name] = {};
                }

                if (!interTower[mem_tower_name][pol_name]) {
                    interTower[mem_tower_name][pol_name] = [];
                }

                interTower[mem_tower_name][pol_name] = [
                    ...interTower[mem_tower_name][pol_name],
                    `${towerId}:${policyName}`,
                ];
            }
        }

        return new_mems;
    }

    //
    //
    //
    //
    function checkAllMembersInLayer(member_of, towerName, dataJson) {
        let max = 0;
        let count = 0;
        let memName = [];

        for (let mem of member_of) {
            let found = false;

            for (let layer in dataJson[towerName]) {
                if (dataJson[towerName][layer][mem]) {
                    max = Math.max(max, parseInt(layer, 10));
                    found = true;
                    break;
                }
            }

            if (!found) {
                count++;
                memName.push(mem);
            }
        }

        return { max: count === 0 ? max : -1, count, memName };
    }

    //
    //
    //
    //
    //
    function addPolicyToLayer(towerName, policyName, max, dataJson) {
        const layerName = Number(max) + 1;

        if (!dataJson[towerName][layerName]) {
            dataJson[towerName][layerName] = {};
        }

        dataJson[towerName][layerName][policyName] = {};
    }

    //
    //
    //
    //
    function updateHelperJson(towerName, policyName, rawjson, dataJson, helperJson, interTower) {
        for (let key in helperJson[towerName][UNORDEREDLISTK]) {
            let mems = helperJson[towerName][UNORDEREDLISTK][key];

            if (mems.includes(policyName)) {
                mems.splice(mems.indexOf(policyName), 1);
            }

            if (mems.length === 1) {
                if (helperJson[towerName][HELPERJSONK][mems[0]]) {
                    helperJson[towerName][HELPERJSONK][mems[0]][key] = rawjson[towerName][key].member_of;
                } else {
                    helperJson[towerName][HELPERJSONK][mems[0]] = {
                        [key]: rawjson[towerName][key].member_of,
                    };
                }
                delete helperJson[towerName][UNORDEREDLISTK][key];
            }
        }

        if (policyName in helperJson[towerName][HELPERJSONK]) {
            const obj = helperJson[towerName][HELPERJSONK][policyName];
            delete helperJson[towerName][HELPERJSONK][policyName];

            for (let key in obj) {
                insertIntoLayer(towerName, key, obj[key], rawjson, dataJson, helperJson, interTower);
            }
        }
    }

    //
    //
    //
    //
    //
    function handleUnlayeredPolicies(towerName, policyName, member_of, count, memName, helperJson) {
        if (count === 1) {
            helperJson[towerName][HELPERJSONK][memName[0]] = {
                ...helperJson[towerName][HELPERJSONK][memName[0]],
                [policyName]: member_of,
            };
        } else if (count >= 2) {
            helperJson[towerName][UNORDEREDLISTK][policyName] = memName;
        }
    }

    //
    //
    //
    //
    //
    function addChildAndParentReferences(dataJson, rawjson, interTower) {
        for (let tower in rawjson[TOWERS]) {
            const layerJson = dataJson[tower];
            const outputJson = {};

            for (let layer in layerJson) {
                outputJson[layer] = {};

                for (let policy in layerJson[layer]) {
                    const policyData = rawjson[tower][policy] || rawjson[tower][INTERTOWER][policy];
                    outputJson[layer][policy] = {
                        [CHILDS]: {},
                        [PARENTS]: {},
                        ...policyData,
                    };
                }

                for (let policy in layerJson[layer]) {
                    addReferences(layer, policy, tower, rawjson, outputJson, interTower);
                }
            }

            dataJson[tower] = outputJson;
        }
    }

    //
    //
    //
    //
    //
    function addReferences(layer, policy, towerName, rawjson, outputJson, interTower) {
        const inputJson = rawjson[towerName];
        const policyData = outputJson[layer][policy];

        if (interTower[towerName] && interTower[towerName][policy]) {
            policyData[UNLAYEREDCHILDS] = [...interTower[towerName][policy]];
        }

        const { members, inter, towerId } = separateMembers(inputJson, policy);

        addParentChildRelations(layer, policy, members, towerName, outputJson);

        if (inter.length > 0) {
            policyData[INTERPARENTS] = inter;
        }

        if (towerId) {
            policyData[TOWERID] = towerId;
        }
    }

    //
    //
    //
    //
    //
    function separateMembers(inputJson, policy) {
        const members = [];
        const inter = [];
        let towerId = null;

        const member_of =
            inputJson[INTERTOWER] && inputJson[INTERTOWER][policy]
                ? inputJson[INTERTOWER][policy][MEMBEROF]
                : inputJson[policy]?.[MEMBEROF] || [];

        for (let mem of member_of) {
            if (mem.includes(":")) {
                inter.push(mem);
            } else {
                members.push(mem);
            }
        }

        if (inputJson[INTERTOWER] && inputJson[INTERTOWER][policy]?.[TOWERID]) {
            towerId = inputJson[INTERTOWER][policy][TOWERID];
        }

        return { members, inter, towerId };
    }

    //
    //
    //
    //
    //
    function addParentChildRelations(layer, policy, members, towerName, outputJson) {
        for (let member of members) {
            const parentLayer = findLayer(member, outputJson);
            const policyData = outputJson[layer][policy];

            if (!policyData[PARENTS][parentLayer]) {
                policyData[PARENTS][parentLayer] = [];
            }

            policyData[PARENTS][parentLayer].push(member);

            if (!outputJson[parentLayer][member][CHILDS][layer]) {
                outputJson[parentLayer][member][CHILDS][layer] = [];
            }

            outputJson[parentLayer][member][CHILDS][layer].push(policy);
        }
    }

    //
    //
    //
    //
    //
    function addTowerDetails(rawjson, dataJson) {
        for (let tower in rawjson[TOWERS]) {
            //adding the tower level masks filters and pii visibility if
            if (rawjson[tower][MASKS]) {
                dataJson[tower][MASKS] = rawjson[tower][MASKS];
            }

            if (rawjson[tower][FILTER]) {
                dataJson[tower][FILTER] = rawjson[tower][FILTER];
            }

            if (rawjson[tower]?.[PIIVISIBILITY] && rawjson[tower]?.[PIIVISIBILITY].length > 0) {
                dataJson[tower][PIIVISIBILITY] = rawjson[tower][PIIVISIBILITY];
            }
        }
    }

    return algo;
}
export default GetDataJson;
