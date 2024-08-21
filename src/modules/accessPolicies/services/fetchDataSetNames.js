import axios from "axios";

const fetchDatasetNames = async () => {
  return axios.get(`/tablenames`).then((res) => {
    console.log("res = ", res);
    // res = `{"datasets":[{"tableName":"abc","policies":10}]}`;
    // data = JSON.parse(res.data);
    // console.log("tablenames = ", data.tablenames);
    const data = res.data.datasets;
    // console.log("data retured = ", data);
    // return data;
    // console.log("hgfhj", JSON.parse(res).datasets);
    return data;
  });
};

export default fetchDatasetNames;
