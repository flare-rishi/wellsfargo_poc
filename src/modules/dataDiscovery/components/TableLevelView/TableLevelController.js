import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ErrorPage from "../../../errorpages/ErrorPage";

import TableAndJobsLayoutController from "../layout/tablesAndJobsLayout/TableAndJobsLayoutController";

import useGetSearchParams from "../../hooks/useLocationHooks/useGetSearchParams";

import {
    fetchQualityMetricsAsync,
    fetchTableAdjustmentsAsync,
    fetchTableExploreAsync,
    fetchTableMetaDataAsync,
    fetchTableRecordsCountAsync,
    fetchTableSchemaAsync,
    fetchTableVersionsAsync,
} from "../../slices/tableLevelSlice/tableThunk";

import {
    resetAllTheStates,
    selectAreApisPending,
    selectLatestVersion,
    selectQueryString,
    selectRecordsCountLoading,
    selectTableNotFound,
    selectTableVersionData,
    selectTableVersionLastFetched,
    selectVersionGraphLoading,
    selectVersionNotFound,
    updateAllowClick,
    updateAreApisPending,
    updateQuerystring,
} from "../../slices/tableLevelSlice/tableLevelSlice";

import { EXPLORE, LATEST, TABLELEVELTABS, VIEWTYPETABLLE } from "../../../../constants/constants";
import { checkObjectIsValid } from "../../../../utilities/utilities";
import { selectActiveTab, updateActiveTab } from "../../../../slice/tabs/tabSlice";
import useNavigateToDataset from "../../hooks/useLocationHooks/useNavigateToDataset";
import { fetchSelectedAclsAsync } from "../../../accessPolicies/slices/dataSlice/aclsThunk";
import { updateAclJsonData, updateData } from "../../../accessPolicies/slices/dataSlice/dataSlice";
import useGetData from "../../../accessPolicies/hooks/getData";
import GetDataJson from "../../../accessPolicies/hooks/GetDataJson";
import { resetUserGroupDropDown } from "../../../../slice/userSlices/userSlice";
import { checkInTimePeriod } from "../../utilities/utilities";

const TableLevelController = () => {
    const [newPath, setNewPath] = useState(null);
    const { domainName, dataSetName, tableName } = useParams();
    const [fetchAcls, setFetchAcls] = useState(false);

    const dispatch = useDispatch();

    const activeTab = useSelector(selectActiveTab);

    const tableVersionData = useSelector(selectTableVersionData);
    const versionGraphLoading = useSelector(selectVersionGraphLoading);
    const areApisPending = useSelector(selectAreApisPending);
    const recordsCountLoading = useSelector(selectRecordsCountLoading);
    const latestVersion = useSelector(selectLatestVersion);
    const versionNotFound = useSelector(selectVersionNotFound);
    const tableNotFound = useSelector(selectTableNotFound);
    const algo = GetDataJson();
    const queryString = useSelector(selectQueryString);
    const VersionGraphLastFetched = useSelector(selectTableVersionLastFetched);

    let { versionId, forkId, setSearchParams } = useGetSearchParams();

    const NavigateToDataset = useNavigateToDataset();

    const handleFetchInitialData = async (refresh = false) => {
        dispatch(fetchTableVersionsAsync({ domainName, dataSetName, tableName, refresh })).then((response) => {
            console.log("75 ", response);

            let updateUrlVersion = response.payload.latestVersion;
            if (!versionId || versionNotFound || versionId === LATEST || versionId === "undefined") {
                setSearchParams({ versionId: updateUrlVersion });
            }
        });
    };

    const batchApiCalls = async () => {
        if (checkObjectIsValid(tableVersionData)) {
            dispatch(updateAreApisPending(true));
            if (versionId === LATEST || versionId === "undefined") {
                versionId = latestVersion;
            }
            if (checkObjectIsValid(tableVersionData)) {
                let promises = [];

                if (activeTab === EXPLORE) {
                    promises.push(
                        dispatch(
                            fetchTableExploreAsync({
                                domainName,
                                dataSetName,
                                tableName,
                                versionId,
                                forkId,
                            })
                        )
                    );
                }
                promises.push(
                    dispatch(
                        fetchTableSchemaAsync({
                            domainName,
                            dataSetName,
                            tableName,
                            versionId,
                            forkId,
                        })
                    )
                );

                promises.push(
                    dispatch(
                        fetchTableRecordsCountAsync({
                            domainName,
                            dataSetName,
                            tableName,
                            versionId,
                            forkId,
                        })
                    )
                );

                promises.push(
                    dispatch(
                        fetchQualityMetricsAsync({
                            domainName,
                            dataSetName,
                            tableName,
                            versionId,
                            forkId,
                        })
                    )
                );
                promises.push(
                    dispatch(
                        fetchTableAdjustmentsAsync({
                            domainName,
                            dataSetName,
                            tableName,
                            versionId,
                            forkId,
                        })
                    )
                );

                promises.push(
                    dispatch(
                        fetchTableMetaDataAsync({
                            domainName,
                            dataSetName,
                            tableName,
                            versionId,
                            forkId,
                        })
                    )
                );

                await Promise.all(promises)
                    .then((response) => {
                        console.log("response 137", response);
                    })
                    .catch((error) => {
                        console.log("ERROR 140", error);
                    })
                    .finally(() => {
                        dispatch(updateAreApisPending(false));
                    });
                setFetchAcls(true);
            }
        }
    };

    const handleOnRefresh = async () => {
        dispatch(updateActiveTab(TABLELEVELTABS[0]));
        await dispatch(resetAllTheStates());
        dispatch(resetUserGroupDropDown());

        handleFetchInitialData(true);
    };

    // useEffect(() => {
    //     if (fetchAcls && !queryString.includes(null)) {
    //         dispatch(fetchSelectedAclsAsync({ domainName, dataSetName, tableName, versionId, forkId })).then(
    //             (response) => {
    //                 console.log("response", response);
    //                 if (response.type === "table/ fetchSelectedAcls/fulfilled") {
    //                     dispatch(updateData({ ...algo(response.payload[queryString]["data"].acls) }));
    //                     dispatch(updateAclJsonData(response.payload));
    //                 }
    //             }
    //         );
    //     }
    // }, [fetchAcls, queryString]);

    useEffect(() => {
        handleFetchInitialData();
    }, [tableName]);

    useEffect(() => {
        batchApiCalls();
    }, [versionId, forkId, tableVersionData]);

    useEffect(() => {
        let flag = versionGraphLoading || areApisPending || recordsCountLoading;
        dispatch(updateAllowClick(flag));
    }, [versionGraphLoading, areApisPending, recordsCountLoading]);

    useEffect(() => {
        if (tableNotFound) setNewPath(NavigateToDataset());
    }, [tableNotFound]);

    useEffect(() => {
        let queryString = domainName + dataSetName + tableName + "-" + versionId;
        if (forkId) {
            queryString += forkId;
        }
        dispatch(updateQuerystring(queryString));
    }, [versionId, forkId]);

    return tableNotFound ? (
        <ErrorPage link={newPath} />
    ) : (
        <TableAndJobsLayoutController type={VIEWTYPETABLLE} handleOnClickRefresh={handleOnRefresh} />
    );
};

export default TableLevelController;
