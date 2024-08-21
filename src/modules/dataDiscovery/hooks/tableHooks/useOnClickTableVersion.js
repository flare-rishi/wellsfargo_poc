import { useDispatch } from "react-redux";
import {
  updateHighlightTableCircle,
  updateTableLevelData,
  updateTableLoading,
  updateTableSchema,
  updateTableSchemaMetaData,
} from "../../slices/tableLevelSlice/tableLevelSlice";
import fetchTableDetails from "../../services/tableServices/fetchTableDetails";
import fetchTableSchemaMetaData from "../../services/tableServices/fetchTableSchemaMetaData";
import fetchTableSchema from "../../services/tableServices/fetchTableSchema";

function useOnCliCkTableVersion() {
  const dispatch = useDispatch();
  const onClickTableVersion = async (
    version,
    domainName,
    dataSetName,
    tableName
  ) => {
    dispatch(updateHighlightTableCircle(version));
  };
  return onClickTableVersion;
}

export default useOnCliCkTableVersion;
