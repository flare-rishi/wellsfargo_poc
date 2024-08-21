import Axios from "../../../../axiosConfig/Axios";

//fetch the datasets  of a domain

export const fetchAllDataSets = () => {
    let response = require("../../.././../jsonFiles/domainData.json");
    return response;
};
