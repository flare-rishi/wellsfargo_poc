import React from "react";
import { Handle } from "reactflow";

const JobNode = ({ data }) => {
    const inputHandles = data.inputs.map((input, index) => (
        <Handle
            key={`input-${input}`}
            type="target"
            position="left"
            id={`input-${input}`}
            style={{ top: `${index + 1} * 20}px` }}
        />
    ));
    const outputHandles = data.outputs.map((output, index) => (
        <Handle
            key={`output-${output}`}
            type="source"
            position="right"
            id={output}
            style={{ top: `${index + 1} * 20}px` }}
        />
    ));

    const statusColor = data.status === "success" ? "green" : data.status === "running" ? "orange" : "blue";
    return (
        <div style={{ padding: 10, border: "1px solid black", borderRadius: 5 }}>
            {/* <Handle type="target" position="left" /> */}
            {inputHandles}
            <strong>{data.label}</strong>
            <div style={{ color: `${statusColor}` }}>{data.status}</div>
            <div style={{ color: "purple" }}>{data.duration}</div>
            {outputHandles}
            {/* <Handle type="source" position="right" /> */}
        </div>
        // <div>
        //   <strong>{data.label}</strong>
        //   <div>Status: {data.status}</div>
        //   <div>Inputs: {data.inputs}</div>
        //   <div>Outputs: {data.outputs}</div>
        // </div>
    );
};
export default JobNode;
