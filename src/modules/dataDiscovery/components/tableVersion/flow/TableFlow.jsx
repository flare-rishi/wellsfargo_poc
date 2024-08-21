import ReactFlow, { ReactFlowProvider } from "reactflow";

import "reactflow/dist/style.css";

import Circle from "../cricle/Cricle";
import Rectangle from "../rectangle/Rectangle";
import CustomStepEdge from "../customStepEdge/CustomStepEdge";

import "./TableFlow.css";

const nodeTypes = {
  circular2: Circle,
  rectangular2: Rectangle,
};
const edgeTypes = {
  customStepEdge: CustomStepEdge,
};

const TableFlow = ({ edges, nodes, onEdgesChange, onNodesChange }) => {
  return (
    <div className="table-versioning">
      <ReactFlowProvider>
        <ReactFlow
          edges={edges}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        ></ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default TableFlow;
