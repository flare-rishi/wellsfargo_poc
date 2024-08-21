import ReactFlow, { Controls, Background } from "reactflow";

import Edge from "./edge/Edge";
import Node from "./node/Node";

import "reactflow/dist/style.css";
import "./flow.css";

const nodeTypes = { node: Node };
const edgeTypes = { customedge: Edge };

function Flow({ nodes, edges, onEdgesChange, onNodesChange, onConnect, onMove }) {
    return (
        <div className="visual-box">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                onMoveEnd={onMove}
                nodesDraggable={false}
                zoomOnDoubleClick={false}
                positions={{ x: 0, y: 0 }}
                defaultViewport={{ x: 50, y: 50, zoom: 1 }}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}

export default Flow;
