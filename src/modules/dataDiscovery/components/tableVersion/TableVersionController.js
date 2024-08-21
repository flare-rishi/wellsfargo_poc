import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useTableVersion from "../../hooks/tableHooks/useTableVersion";
import Skeleton from "../../../skeleton/Skeleton";
import TableFlow from "./flow/TableFlow";

import { checkObjectIsValid } from "../../../../utilities/utilities";

import {
    selectHighlightTableCircle,
    selectTableVersionData,
    selectVersionGraphError,
    selectVersionGraphLoading,
} from "../../slices/tableLevelSlice/tableLevelSlice";
import ErrorMsg from "../../../../library/errorsDiv/ErrorMsg";
import { SOMETHING_WENT_WRONG } from "../../../../constants/constants";

const TableVersionController = () => {
    const [edges, setEdges, onEdgesChange] = useState([]);
    const [nodes, setNodes, onNodesChange] = useState([]);

    const tableVersionData = useSelector(selectTableVersionData);
    const versionGraphLoading = useSelector(selectVersionGraphLoading);
    const highlightedCircle = useSelector(selectHighlightTableCircle);
    const versionGraphError = useSelector(selectVersionGraphError);

    const flowGenerator = useTableVersion();

    //this code is for minimap manipulation
    const nodeClassName = (node) => {
        if (highlightedCircle == null) {
            return "";
        } else {
            if (node.data.label === highlightedCircle) {
                return "minimap-selected-node";
            } else {
                return "minimap-unselected";
            }
        }
    };

    //this code is for minimap node colors
    const nodeColor = (node) => {
        return node.data.color;
    };

    useEffect(() => {
        if (tableVersionData && Object.keys(tableVersionData).length > 0) {
            let [nodeData, edgeData] = flowGenerator(tableVersionData);
            setNodes(nodeData);
            setEdges(edgeData);
        }
    }, [tableVersionData]);

    console.log("tableVersionData ", tableVersionData);

    return versionGraphLoading ? (
        <Skeleton />
    ) : versionGraphError ? (
        <ErrorMsg errorMsg={versionGraphError || SOMETHING_WENT_WRONG} />
    ) : (
        checkObjectIsValid(tableVersionData) && (
            <TableFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeClassName={nodeClassName}
                nodeColor={nodeColor}
            />
        )
    );
};

export default TableVersionController;
