import Axios from "../../../../axiosConfig/Axios";

//fetch the acls   of a table

export const fetchSelectedAcls = (domainName, dataSetName, tableName, versionId) => {
    let response = require("../../.././../jsonFiles/acls.json");
    return response;
};

//post acls of the table to the server

export const PostUpdatedAcls = (jsonData, domainName, dataSetName, tableName, versionId, forkId) => {
    let url = `/send/${domainName}/${dataSetName}/${tableName}/${versionId}`;
    if (forkId) {
        url += `?forkId=${forkId}`;
    }
    return Axios.post(url, jsonData);
};
