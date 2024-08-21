import { useSelector } from "react-redux";
import { selectSelectedNodes } from "../../slices/flowSlice/flowSlice";

function useGetSelectedNode() {
  const selectedNode = { ...useSelector(selectSelectedNodes) };
  function getSelectedNode() {
    return selectedNode;
  }
  return getSelectedNode;
}

export default useGetSelectedNode;
