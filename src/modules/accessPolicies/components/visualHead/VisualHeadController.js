import React, { useEffect, useState } from "react";
import VisualHead from "./VisualHead";
import { useDispatch, useSelector } from "react-redux";
import {
    selectFlowPosition,
    selectSelectedNodes,
    updateFlowPosition,
    updateSelectedNodes,
} from "../../slices/flowSlice/flowSlice";
import { selectActiveTab, updateSearchedPolicy, updateTableEditModalData } from "../../slices/crud/crudSlice";
import useConvertToOriginalJson from "../../hooks/useConvertToOriginal/useConvertToOriginal";
import {
    selectUnSavableNodes,
    selectUnSavableTabs,
    updateEditedNodes,
    updateEditedTowers,
} from "../../slices/save/saveSlice";

import toast from "react-hot-toast";
import postJsonData from "../../services/postJsonData";
import useGetOptions from "../../hooks/useGetOptions/getOptions";
import {
    selectData,
    selectIsSplitViewOpen,
    selectTextEditor,
    selectTextEditorData,
    updateAclJsonData,
    updateSplitView,
    updateSplitViewData,
    updateTextEditor,
    updateTextEditorData,
} from "../../slices/dataSlice/dataSlice";
import { useReactFlow } from "reactflow";
import { selectUrl } from "../../../dataDiscovery/slices/wareHouseSlice/wareHouseSlice";
import useApplyEditorData from "../../hooks/useApplyEditorData/useApplyEditorData";
import { json } from "react-router-dom";
import { PostUpdatedAclsAsync } from "../../slices/dataSlice/aclsThunk";
import { updateTableExplore, updateTableSchema } from "../../../dataDiscovery/slices/tableLevelSlice/tableLevelSlice";
const VisualHeadController = ({
    isOpen,
    towers,
    selectedDataset,
    highlightDataSet,
    domainName,
    dataSetName,
    tableName,
    versionId,
    forkId,
}) => {
    const [options, setOptions] = useState([]);
    const [showSplitViewButton, setShowSplitViewButton] = useState(false);

    const { getAllPolicyNames } = useGetOptions();

    const activeTab = useSelector(selectActiveTab);
    const flowPosition = useSelector(selectFlowPosition);
    const unSavableNodes = useSelector(selectUnSavableNodes);
    const unSavableTabs = useSelector(selectUnSavableTabs);
    const dataJson = useSelector(selectData);
    const selectedNodes = useSelector(selectSelectedNodes);
    const isSplitViewOpen = useSelector(selectIsSplitViewOpen);
    const isTextEditor = useSelector(selectTextEditor);
    const applyEditorData = useApplyEditorData();
    const textEditorData = useSelector(selectTextEditorData);

    // console.log("selected nodes from the visualController ", selectedNodes);

    useEffect(() => {
        if (Object.keys(selectedNodes).length > 0) {
            setShowSplitViewButton(true);
        } else {
            setShowSplitViewButton(false);
            dispatch(updateSplitView(false));
        }
    }, [selectedNodes]);

    useEffect(() => {
        setOptions(getAllPolicyNames());
    }, [dataJson, activeTab]);
    const reactFlow = useReactFlow();
    const dispatch = useDispatch();
    const convertBack = useConvertToOriginalJson();
    // const getTowerNames = useGetTowerNames();
    function handleFitView() {
        reactFlow.fitView({ padding: 0.2, duration: 200 });

        const pos = reactFlow.getViewport();

        dispatch(
            updateFlowPosition({
                ...flowPosition,
                [activeTab]: { pos },
            })
        );
    }

    function handleSplitView() {
        dispatch(updateSplitView(!isSplitViewOpen));
        dispatch(updateSplitViewData(selectedNodes));
    }
    function resetHandleClick() {
        dispatch(updateSelectedNodes({}));
    }
    function handleSearch(nodeName) {
        dispatch(updateSearchedPolicy(nodeName));
    }
    function handleDoubleClickOnTable() {
        dispatch(updateTableEditModalData(highlightDataSet));
    }

    function hanldeTextEditorOpening() {
        dispatch(updateTextEditorData(JSON.stringify({ ...convertBack(false) }, null, 2)));
        dispatch(updateTextEditor(!isTextEditor));
        console.log("done true");
    }

    function applyTextEditorData() {
        const textEditorDataJson = JSON.parse(textEditorData);
        applyEditorData(textEditorDataJson);
        toast.success("Applied Successfully");
    }

    function saveToDisk() {
        if (unSavableNodes !== 0) {
            toast.error("Rename Nodes to save");
        } else if (unSavableTabs !== 0) {
            toast.error("Rename Tabs to save");
        } else {
            toast.error("cannot save ");
        }
    }

    return (
        <VisualHead
            towers={towers}
            handleFitView={handleFitView}
            isOpen={isOpen}
            selectedDataset={selectedDataset}
            saveToDisk={saveToDisk}
            handleDoubleClickOnTable={handleDoubleClickOnTable}
            options={options}
            handleSearch={handleSearch}
            resetHandleClick={resetHandleClick}
            handleSplitView={handleSplitView}
            hanldeTextEditorOpening={hanldeTextEditorOpening}
            isTextEditor={isTextEditor}
            showSplitViewButton={showSplitViewButton}
            applyTextEditorData={applyTextEditorData}
        />
    );
};

export default VisualHeadController;
