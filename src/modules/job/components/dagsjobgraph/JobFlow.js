import ReactFlow, { ReactFlowProvider, Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import "./JobFlow.css";
import JobNode from "./JobNode";
import CustomEdge from "./CustomEdge";
import TableNode from "./inputTableNodes/TableNode";

const nodeTypes = {
    jobNode: JobNode,
    tableNode: TableNode,
};
const edgeTypes = {
    customEdge: CustomEdge,
};

export const JobFlow = ({ edges, nodes }) => {
    return (
        <div className="job-level-main-div div-background-border">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    // onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange}
                    fitView
                >
                    <Controls />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};
