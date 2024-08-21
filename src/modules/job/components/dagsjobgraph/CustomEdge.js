// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   style = {},
//   markerEnd,
// }) => {
//   return (
//     <path
//       id={id}
//       className="react-flow__edge-path"
//       d={`M${sourceX},${sourceY}L${targetX},${targetY}`}
//       style={style}
//       markerEnd={markerEnd}
//     />
//   );
// };
// export default CustomEdge;
import React from "react";
import { getSmoothStepPath } from "reactflow";

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    arrowHeadType,
    markerEndId,
}) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <path
            id={id}
            style={style}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEndId}
            arrowHeadType={arrowHeadType}
        />
    );
};

export default CustomEdge;
