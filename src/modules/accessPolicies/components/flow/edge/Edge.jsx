import React, { useEffect, useState } from "react";
import { getBezierPath, getMarkerEnd } from "reactflow";
import { selectSelectedNodes } from "../../../slices/flowSlice/flowSlice";
import { useSelector } from "react-redux";
import "./edge.css";
import { selectIsSplitViewOpen } from "../../../slices/dataSlice/dataSlice";
const Edge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}) => {
  const [hide, setHide] = useState(true);
  const selectedNodes = useSelector(selectSelectedNodes);
  const isSplitViewOpen = useSelector(selectIsSplitViewOpen);

  useEffect(() => {
    if (!isSplitViewOpen) {
      for (let clickedNode in selectedNodes) {
        var sourceFlag = 0;
        var targetFlag = 0;
        if (source == clickedNode || target == clickedNode) {
          sourceFlag = 1;
          targetFlag = 1;
        } else {
          // code part of source flag in layered part
          // if (
          //   selectedNodes[clickedNode][data.sourceLayer] &&
          //   selectedNodes[clickedNode][data.sourceLayer].includes(source)
          // ) {
          //   sourceFlag = 1;
          // } else {
          //   sourceFlag = 0;
          // }

          if (
            selectedNodes[clickedNode]["parentsNodes"] &&
            selectedNodes[clickedNode]["parentsNodes"][data.sourceLayer] &&
            selectedNodes[clickedNode]["parentsNodes"][
              data.sourceLayer
            ].includes(source) &&
            selectedNodes[clickedNode]["parentsNodes"][data.targetLayer] &&
            selectedNodes[clickedNode]["parentsNodes"][
              data.targetLayer
            ].includes(target)
          ) {
            sourceFlag = 1;
            targetFlag = 1;
          }
          if (
            selectedNodes[clickedNode]["childsNodes"] &&
            selectedNodes[clickedNode]["childsNodes"][data.sourceLayer] &&
            selectedNodes[clickedNode]["childsNodes"][
              data.sourceLayer
            ].includes(source) &&
            selectedNodes[clickedNode]["childsNodes"][data.targetLayer] &&
            selectedNodes[clickedNode]["childsNodes"][
              data.targetLayer
            ].includes(target)
          ) {
            sourceFlag = 1;
            targetFlag = 1;
          }
        }

        if (sourceFlag == 1 && targetFlag == 1) {
          setHide(false);
          break;
        } else {
          setHide(true);
        }
      }
    }
  }, [selectedNodes, isSplitViewOpen]);

  // Constrct the Svg path
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  // Determine the arrow end to use
  const markerEndId = getMarkerEnd(markerEnd, id);

  return (
    <path
      id={id}
      className={` ${
        Object.keys(selectedNodes).length === 0
          ? "normalEdge"
          : hide
          ? "transparentEdge"
          : "highlightEdge animated-edge"
      } transition-edge react-flow__edge-path`}
      d={edgePath}
      markerEnd={markerEndId}
    />
  );
};

export default Edge;
