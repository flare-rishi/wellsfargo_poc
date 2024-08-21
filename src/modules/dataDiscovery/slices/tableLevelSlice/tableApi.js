import Axios from "../../../../axiosConfig/Axios";

//api fetch the versions of a table

//common api call for all the apis for the table apis
export const commonAPi = (endPoint, domainName, dataSetName, tableName, versionId, forkId, userGroup, rows) => {
    let url = `/${endPoint}/${domainName}/${dataSetName}/${tableName}/${versionId}`;

    if (forkId) {
        url += `?forkId=${forkId}`;
        if (userGroup) {
            url += `&userGroup=${userGroup}`;
        }
        if (rows) {
            url += `&rows=${rows}`;
        }
    } else {
        if (userGroup) {
            url += `?userGroup=${userGroup}`;
        }
        if (rows) {
            url += `&rows=${rows}`;
        }
    }

    return Axios.get(url, { cache: true });
};

// post request

export const postApiForFork = (domainName, dataSetName, tableName, versionId, body, userGroup) => {
    return Axios.post(`createfork/${domainName}/${dataSetName}/${tableName}/${versionId}`, body);
};

export const updateForkApi = (domainName, dataSetName, tableName, versionId, forkId, body) => {
    return Axios.put(`updatefork/${domainName}/${dataSetName}/${tableName}/${versionId}/${forkId}`, body);
};

export const deleteForkApi = (domainName, dataSetName, tableName, versionId, forkId) => {
    return Axios.delete(`deletefork/${domainName}/${dataSetName}/${tableName}/${versionId}/${forkId}`);
};

export const fetchTableVersions = () => {
    let response = require("../../.././../jsonFiles/tableVersionData.json");
    return response;
};

export const fetchTableMetaData = () => {
    let response = require("../../.././../jsonFiles/tableMetaData.json");
    return response;
};

export const fetchTableSchema = () => {
    let response = require("../../.././../jsonFiles/tableSchema.json");
    return response;
};

export const fetchRows = () => {
    let response = require("../../.././../jsonFiles/tableRows.json");
    return response;
};

export const fetchAdjustments = () => {
    let response = require("../../.././../jsonFiles/tableAdjustments.json");
    return response;
};

export const fetchExplore = () => {
    let response = require("../../.././../jsonFiles/tableExplore.json");
    return response;
};

export const fetchQualityMetrics = () => {
    let response = require("../../.././../jsonFiles/tableQualityMetrics.json");
    return response;
};

export const fetchTablePath = () => {
    let response = require("../../.././../jsonFiles/tablePath.json");
    return response;
};

export const fetchForkDetails = () => {
    let response = require("../../.././../jsonFiles/forkDetails.json");
    return response;
};
