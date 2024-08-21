import { useDispatch, useSelector } from "react-redux";
import {
  selectTextEditorData,
  updateData,
  updateTextEditor,
} from "../../slices/dataSlice/dataSlice";
import GetDataJson from "../GetDataJson";

const useApplyEditorData = () => {
  const dispatch = useDispatch();

  const algo = GetDataJson();
  function applyEditorData(textEditorData) {
    dispatch(updateData({ ...algo(textEditorData) }));
    dispatch(updateTextEditor(false));
  }

  return applyEditorData;
};

export default useApplyEditorData;
