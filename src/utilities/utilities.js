// Function to replace spaces with hyphens

export function replaceSpacesWithHyphens(str) {
    return str.replace(/ /g, "-");
}

// Function to revert hyphens to spaces

export function revertHyphensToSpaces(str) {
    return str.replace(/-/g, " ");
}

//Checks if a given object or array is defined (not null or undefined).

export function checkObjectIsValid(obj) {
    return obj && Object.keys(obj).length > 0;
}

// construct full fledged path

export function constructFullFLedgedPath({ domainName, dataSetName, tableName, versionId, forkId, userGroup }) {
    let queryString = {};
    queryString = domainName + dataSetName + tableName + "-" + versionId;
    if (forkId) {
        queryString += forkId;
    }

    if (userGroup) {
        queryString += userGroup;
    }
    return queryString;
}
