import axios from "axios";

const fetchSelectedDataJson = async (
  url,
  domainName,
  dataSetName,
  tableName
) => {
  return axios
    .get(`${url}/gs/read/${domainName}/${dataSetName}/${tableName}`)
    .then((res) => {
      return res.data; // Return the data within the resolved Promise
    });
};

export default fetchSelectedDataJson;
