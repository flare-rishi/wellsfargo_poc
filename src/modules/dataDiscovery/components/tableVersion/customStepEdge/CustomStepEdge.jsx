import React from "react";

const CustomStepEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  // this custom edge first go up or down and after reaching to the height of target node it goes left or right
  const getPath = () => {
    const verticalPath = `M${sourceX},${sourceY} L${sourceX},${targetY}`;
    const horizontalPath = `L${targetX},${targetY}`;
    return `${verticalPath} ${horizontalPath}`;
  };
  const path = getPath();

  return (
    <g className="react-flow__edge">
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />
    </g>
  );
};

export default CustomStepEdge;
