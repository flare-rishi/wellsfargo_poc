import React, { useEffect } from "react";
import { Handle } from "reactflow";
import { Position } from "reactflow";
import { useDispatch, useSelector } from "react-redux";

import useGetSearchParams from "../../../hooks/useLocationHooks/useGetSearchParams";
import useOnClickGraphEL from "../../../hooks/tableHooks/useOnClickGraphEL";

import {
    selectAllowCLick,
    selectHighlightTableCircle,
    selectLatestVersion,
    updateHighlightTableCircle,
    updateQuerystring,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import "./Circle.css";
import { LATEST, TABLENAME } from "../../../../../constants/constants";

const Circle = ({ data }) => {
    const dispatch = useDispatch();

    const allowClick = useSelector(selectAllowCLick);
    const highlightedCircle = useSelector(selectHighlightTableCircle);
    const latestVersion = useSelector(selectLatestVersion);

    let { versionId, forkId } = useGetSearchParams();
    const handleOnCLick = useOnClickGraphEL();

    const dateStyle = {
        marginTop: `${data.direction == 0 ? "5px" : "none"}`,
        marginBottom: `${data.direction == 1 ? "5px" : "none"}`,
    };

    const handleStyle = {
        backgroundColor: "transparent",
        border: "none",

        bottom: `${data.direction == 1 ? "15px" : "none"}`,
        top: `${data.direction == 0 ? "15px" : "none"}`,
    };

    function handleTableVersionClick() {
        let queryObj = { versionId: data.label };
        handleOnCLick(queryObj);
    }

    useEffect(() => {
        if (forkId) {
            dispatch(updateHighlightTableCircle(String(forkId)));
        } else {
            if (versionId === LATEST) {
                dispatch(updateHighlightTableCircle(latestVersion));
            } else {
                dispatch(updateHighlightTableCircle(String(versionId)));
            }
        }
    }, [versionId, forkId]);

    return (
        <div>
            <Handle
                type="source"
                position={Position.Right}
                style={{ ...defaultHandleStyle, right: "-1px" }}
                isConnectable={false}
            ></Handle>
            <Handle
                type="target"
                position={Position.Left}
                style={{ ...defaultHandleStyle, left: "-1px" }}
                isConnectable={false}
            ></Handle>
            <Handle
                type="target"
                id="top-target-handle"
                position={Position.Top}
                style={handleStyle}
                isConnectable={false}
            ></Handle>
            <Handle
                type="source"
                id="top-source-handle"
                position={Position.Top}
                style={handleStyle}
                isConnectable={false}
            ></Handle>

            <div
                className={`circle-node-box ${highlightedCircle == data.label && "highlighted-circle"} ${
                    allowClick ? "wait" : "pointer"
                }`}
                onClick={handleTableVersionClick}
            >
                <LinkCircle
                    direction={data.direction === 0 ? 0 : 1}
                    dateStyle={dateStyle}
                    version={data.label}
                    date={data.date}
                    highlightedCircle={highlightedCircle}
                />
                <div
                    className="circle"
                    style={{
                        backgroundColor: `${
                            data.label === highlightedCircle ? `${data.borderColor}` : `${data.color}`
                        }`,
                        opacity: "0.8",

                        // border: `1px solid ${data.borderColor}`,
                    }}
                ></div>

                <LinkCircle
                    direction={data.direction === 0 ? 1 : 0}
                    dateStyle={dateStyle}
                    version={data.label}
                    date={data.date}
                    highlightedCircle={highlightedCircle}
                />
            </div>
            <Handle
                type="source"
                id="bottom-source-handle"
                position={Position.Bottom}
                style={handleStyle}
                isConnectable={false}
            ></Handle>
            <Handle
                type="target"
                id="bottom-target-handle"
                position={Position.Bottom}
                style={handleStyle}
                isConnectable={false}
            ></Handle>
        </div>
    );
};

export default Circle;

const defaultHandleStyle = {
    backgroundColor: "transparent",
    border: "none",
    top: "22px",
};

const LinkCircle = ({ direction, version, dateStyle, date, highlightedCircle }) => {
    return (
        <span
            className="table-version-text"
            style={{
                visibility: `${direction === 1 ? "visible" : "hidden"}`,
                ...dateStyle,
                fontWeight: `${version === highlightedCircle ? "bold" : ""}`,
                color: `${version === highlightedCircle ? "black" : ""}`,
            }}
        >
            {date}
        </span>
    );
};
