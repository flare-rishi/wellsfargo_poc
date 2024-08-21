import React, { useEffect, useState } from "react";
import "./AccessPolicies.css";
import VisualController from "../visual/VisualController";

import { useDispatch, useSelector } from "react-redux";
import GetDataJson from "../../hooks/GetDataJson";
import VisualHeadController from "../visualHead/VisualHeadController";

import {
    selectAclsError,
    selectAclsLoading,
    selectTextEditor,
    selectTowers,
    updateAclJsonData,
    updateData,
    updateDeletedColumns,
    updateTextEditor,
} from "../../slices/dataSlice/dataSlice";

import { ReactFlowProvider } from "reactflow";
import { useParams } from "react-router-dom";

import TextEditor from "../text-editor/TextEditor";
import { fetchSelectedAclsAsync } from "../../slices/dataSlice/aclsThunk";
import Skeleton from "../../../skeleton/Skeleton";
import useGetSearchParams from "../../../dataDiscovery/hooks/useLocationHooks/useGetSearchParams";
import { selectQueryString } from "../../../dataDiscovery/slices/tableLevelSlice/tableLevelSlice";

const AccessPolicies = () => {
    const { domainName, dataSetName, tableName } = useParams();
    let { versionId, forkId } = useGetSearchParams();
    const [highlightDataSet, setHighLightDataSet] = useState();
    const [selected, setSelected] = useState(false);

    const dispatch = useDispatch();
    const algo = GetDataJson();

    const textEditor = useSelector(selectTextEditor);
    const towers = useSelector(selectTowers);
    const loading = useSelector(selectAclsLoading);
    const aclsError = useSelector(selectAclsError);
    const queryString = useSelector(selectQueryString);

    const handleDataSetSelector = (domainName, dataSetName, tableName) => {
        setHighLightDataSet(tableName);
        dispatch(fetchSelectedAclsAsync({ domainName, dataSetName, tableName, versionId, forkId }))
            .then((response) => {
                dispatch(updateData({ ...algo(response.payload.acls) }));
                dispatch(updateAclJsonData({ ...response.payload }));

                dispatch(
                    updateDeletedColumns(response.payload.removed_columns ? response.payload.removed_columns : [])
                );

                setSelected(true);
            })
            .catch((error) => console.log("error", error));
    };

    useEffect(() => {
        if (queryString) handleDataSetSelector(domainName, dataSetName, tableName);
        dispatch(updateTextEditor(false));
    }, [queryString]);

    return (
        <ReactFlowProvider>
            <div className="access-policies">
                {loading ? (
                    <Skeleton />
                ) : aclsError ? (
                    <p>{aclsError}</p>
                ) : (
                    <>
                        <div className="heading-access">
                            {selected && (
                                <VisualHeadController
                                    towers={towers}
                                    selectedDataset={tableName}
                                    highlightDataSet={highlightDataSet}
                                    domainName={domainName}
                                    dataSetName={dataSetName}
                                    tableName={tableName}
                                    versionId={versionId}
                                    forkId={forkId}
                                />
                            )}
                        </div>
                        {selected &&
                            (textEditor == false ? (
                                <>
                                    <VisualController
                                        selectedDataset={tableName}
                                        highlightDataSet={highlightDataSet}
                                        towers={towers}
                                    />
                                </>
                            ) : (
                                <TextEditor></TextEditor>
                            ))}
                    </>
                )}
            </div>
        </ReactFlowProvider>
    );
};

export default AccessPolicies;
