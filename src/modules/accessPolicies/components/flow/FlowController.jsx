import { useEffect, useState, useCallback } from "react";
import Flow from "./Flow";
import getData from "../../hooks/getData";
import { useNodesState, useEdgesState, addEdge } from "reactflow";
import { useDispatch, useSelector } from "react-redux";
import { selectData, selectIsSplitViewOpen, selectSplitViewData } from "../../slices/dataSlice/dataSlice";

import { selectActiveTab, selectEditModalData, selectOpenEditModal } from "../../slices/crud/crudSlice";
import useCreateNode from "../../hooks/useCreateNode/useCreateNode";
import { useReactFlow } from "reactflow";
import EditModalController from "../editModal/EditModalController";
import useGetData from "../../hooks/getData";
import {
    selectFlowPosition,
    selectSelectedNodes,
    updateFlowPosition,
    updateSelectedNodes,
} from "../../slices/flowSlice/flowSlice";
import useConvertToVerticalData from "../../hooks/useVerticalData/useConvertToVerticalData";
import useGetVerticalData from "../../hooks/useVerticalData/useGetVerticalData";
import useInitializer from "../../hooks/useInitializer";

function FlowController() {
    const reactFlow = useReactFlow();

    const dispatch = useDispatch();
    const flowPosition = useSelector(selectFlowPosition);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    // const [nodePositions, setNodePositions] = useState({});
    const [openCreatePolicy, setOpenCreatePolicy] = useState();
    const [newNodeName, setNewNode] = useState();
    const [newNodeData, setNewNodeData] = useState();

    const tabName = useSelector(selectActiveTab);
    const openEditModal = useSelector(selectOpenEditModal);
    const data = useSelector(selectData);
    const modalObj = useSelector(selectEditModalData);
    const isSplitViewOpen = useSelector(selectIsSplitViewOpen);
    const splitViewData = useSelector(selectSplitViewData);

    const selectedNodes = useSelector(selectSelectedNodes);
    const initializer = useInitializer();
    const createNode = useCreateNode();
    const getData = useGetData();
    const convertSelectedToLayer = useConvertToVerticalData();
    const getVerticalData = useGetVerticalData();
    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => {
                return addEdge(params, eds);
            }),
        [setEdges]
    );

    const handleOpenCreatePolicy = () => {
        setOpenCreatePolicy(!openCreatePolicy);
        setNewNodeData("");
        setNewNode("");
    };

    const handleCreateSubmit = () => {
        createNode(newNodeName, newNodeData);
    };

    const onMove = () => {
        const pos = reactFlow.getViewport();
        dispatch(updateFlowPosition({ ...flowPosition, [tabName]: pos }));
    };

    useEffect(() => {
        setNodes([]);
        setEdges([]);
        let obj;
        if (isSplitViewOpen) {
            let layerObj = convertSelectedToLayer(selectedNodes, data[tabName]);
            obj = getVerticalData(layerObj);
        } else {
            obj = getData(data[tabName]);
        }

        setNodes(obj.nodes);
        setEdges(obj.edges);
        // initializer(data);
    }, [data, tabName, isSplitViewOpen]);

    useEffect(() => {
        if (flowPosition[tabName]) {
            reactFlow.setViewport(flowPosition[tabName]);
        } else {
            reactFlow.setViewport({ x: 50, y: 50, zoom: 1 });
        }
        initializer();
    }, [tabName]);

    return (
        <>
            <Flow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                onConnect={onConnect}
                setOpenCreatePolicy={setOpenCreatePolicy}
                handleOpenCreatePolicy={handleOpenCreatePolicy}
                openCreatePolicy={openCreatePolicy}
                newNodeData={newNodeData}
                setNewNodeData={setNewNodeData}
                newNodeName={newNodeName}
                setNewNode={setNewNode}
                tabName={tabName}
                handleCreateSubmit={handleCreateSubmit}
                onMove={onMove}
            ></Flow>
            {openEditModal && <EditModalController obj={modalObj} split={false} />}
        </>
    );
}

export default FlowController;
