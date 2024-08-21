const reserved_keywords_tower_level = ["pii_visibility", "masks", "filter", "preEdit"];

function findLayer(policyName, tower_dataJson) {
    for (let layer in tower_dataJson) {
        if (!reserved_keywords_tower_level.includes(layer)) {
            if (tower_dataJson[layer][policyName]) {
                return layer;
            }
        }
    }
    return "not found";
}

function getLayersOfTower(tower_dataJson) {
    let layers = [];
    for (let key in tower_dataJson) {
        if (!reserved_keywords_tower_level.includes(key)) {
            layers.push(key);
        }
    }
    return layers;
}

function getTowerNameFromTowerId(towersData, towerId) {
    for (let tower in towersData) {
        if (towersData[tower] == towerId) {
            return tower;
        }
    }
    return "no TowerName Found by this Id";
}

function getInter_NonInter_members(member_of) {
    var inter_mem = [];
    var non_inter_member_of = [];
    for (let x = 0; x < member_of.length; x++) {
        if (member_of[x].includes(":")) {
            inter_mem.push(member_of[x]);
        } else {
            non_inter_member_of.push(member_of[x]);
        }
    }

    return { non_inter_member_of, inter_mem };
}

function calculateMaxMember_ofLayer(member_of, tower_dataJson) {
    let currLayers = getLayersOfTower(tower_dataJson);
    let max = 0;
    for (let i = 0; i < member_of.length; i++) {
        var mem_layer = findLayer(member_of[i], tower_dataJson);
        var index = currLayers.indexOf(mem_layer) + 1;
        if (max < index) max = index;
    }
    return max;
}

function removeFromEditMe(editMe, num) {
    let index = editMe.indexOf(num);

    editMe.splice(index, 1);
    return editMe;
}

function extractNumber(str) {
    // Use regular expression to match digits between parentheses
    const match = str.match(/\d+(?=\))/);

    // Check if a match was found
    if (match) {
        return parseInt(match[0], 10); // Parse the matched string as an integer (base 10)
    } else {
        // Handle cases where no number is found (optional)
        return 0; // Or throw an error if desired
    }
}

function preserveBackslashes(input) {
    return input.replace(/\"/g, '\\"');
}

export {
    findLayer,
    getTowerNameFromTowerId,
    getLayersOfTower,
    getInter_NonInter_members,
    calculateMaxMember_ofLayer,
    removeFromEditMe,
    extractNumber,
    preserveBackslashes,
};
