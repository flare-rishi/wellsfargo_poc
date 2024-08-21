import axios from "axios";
import toast from "react-hot-toast";

const postJsonData = async (
  url,
  jsonData,
  domainName,
  dataSetName,
  tableName
) => {
  try {
    const response = await axios.post(
      `${url}/gs/send/${domainName}/${dataSetName}/${tableName}`,
      jsonData
    );
    toast.success("Acl Saved");
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit data");
  }
};

export default postJsonData;
