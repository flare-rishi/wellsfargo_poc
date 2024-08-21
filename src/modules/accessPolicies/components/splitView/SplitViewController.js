import React, { useEffect } from "react";
import SplitView from "./SplitView";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedNodes } from "../../slices/flowSlice/flowSlice";
import { updateSplitViewData } from "../../slices/dataSlice/dataSlice";

const SplitViewController = ({ splitViewData }) => {
  // let updateSplitViewData = { ...splitViewData };
  const selectedNodes = useSelector(selectSelectedNodes);
  console.log("split view  selected nodes", selectedNodes);

  console.log("splitview data 47", splitViewData);

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(updateSplitViewData({}));
    };
  }, []);

  return <SplitView selectedNodes={splitViewData} />;
};

export default SplitViewController;
