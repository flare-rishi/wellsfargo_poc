import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosGitBranch } from "react-icons/io";
import { Position } from "reactflow";
import { Handle } from "reactflow";

import useOnClickGraphEL from "../../../hooks/tableHooks/useOnClickGraphEL";

import {
    selectAllowCLick,
    selectHighlightTableCircle,
    updateForkModalData,
    updateForkModalType,
    updateIsForkModalOpen,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import { GENERATIONS, TITLE } from "../../../../../constants/constants";

import "./Rectangle.css";
import { Title } from "chart.js";
import { fetchForkDetailsAsync } from "../../../slices/tableLevelSlice/tableThunk";
import { useParams } from "react-router-dom";
import useGetSearchParams from "../../../hooks/useLocationHooks/useGetSearchParams";

const Rectangle = ({ data }) => {
    let { domainName, dataSetName, tableName } = useParams();
    let { versionId } = useGetSearchParams();

    const highlightedRectangle = useSelector(selectHighlightTableCircle);
    const allowClick = useSelector(selectAllowCLick);

    const dispatch = useDispatch();

    const handleOnCLick = useOnClickGraphEL();

    //function will open the editableform for fork
    const handleOpenEditForkModal = () => {
        if (!allowClick) {
            let forkId = data.label;
            dispatch(fetchForkDetailsAsync({ domainName, dataSetName, tableName, versionId, forkId }));
            dispatch(updateForkModalType("edit"));
            dispatch(updateIsForkModalOpen(true));
        }
    };
    //
    //

    function handleTableVersionClick() {
        let queryObj = { versionId: data[GENERATIONS], forkId: data.label };
        handleOnCLick(queryObj);
    }
    return (
        <div>
            <Handle type="source" position={Position.Right} style={defaultHandleStyle} isConnectable={false}></Handle>
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
                className={` ${highlightedRectangle == data.label && "highlighted-circle"} ${
                    allowClick ? "wait" : "pointer"
                }  rectangle`}
                style={{
                    backgroundColor: `${highlightedRectangle == data.label ? data.highlightedColor : data.color}`,
                }}
                onClick={handleTableVersionClick}
                onDoubleClick={handleOpenEditForkModal}
            >
                <IoIosGitBranch size={8} />
                <span className="branch-name">{data.label}</span>
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

export default Rectangle;

const handleStyle = { backgroundColor: "transparent", border: "none" };
const defaultHandleStyle = {
    backgroundColor: "transparent",
    border: "none",
    top: "8px",
};
