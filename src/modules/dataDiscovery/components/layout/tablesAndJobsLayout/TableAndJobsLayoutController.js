import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TableAndJobsLayout from "./TableAndJobsLayout";

import {
    resetFormModalError,
    selectAllowCLick,
    selectDidLatestVersionChanged,
    selectHighlightTableCircle,
    selectIsForkModalOpen,
    selectRecordsCountError,
    selectVersionNotFound,
    updateForkModalData,
    updateForkModalType,
    updateIsForkModalOpen,
} from "../../../slices/tableLevelSlice/tableLevelSlice";
import { COLUMNS, TITLE, UPDATEGRAPH, VERSIONNOTFOUND } from "../../../../../constants/constants";
import useGetSearchParams from "../../../hooks/useLocationHooks/useGetSearchParams";
import { fetchTablePathAsync } from "../../../slices/tableLevelSlice/tableThunk";
import { useParams } from "react-router-dom";

const TableAndJobsLayoutController = ({ type, handleOnClickRefresh }) => {
    const { domainName, dataSetName, tableName } = useParams();

    const dispatch = useDispatch();
    const isForkModalOpen = useSelector(selectIsForkModalOpen);
    const [warningMsg, setWarningMsg] = useState(null);

    let { versionId, forkId } = useGetSearchParams();
    const selectedVersion = useSelector(selectHighlightTableCircle);
    const allowClick = useSelector(selectAllowCLick);
    const didLatestVersionChanged = useSelector(selectDidLatestVersionChanged);
    const versionNotFound = useSelector(selectVersionNotFound);
    const recordsError = useSelector(selectRecordsCountError);

    const handleNewForkModalOpen = () => {
        if (!allowClick) {
            dispatch(fetchTablePathAsync({ domainName, dataSetName, tableName, versionId }));
            dispatch(updateForkModalType("create"));
            dispatch(updateIsForkModalOpen(true));
        }
    };

    const handleCloseFormModal = () => {
        dispatch(updateForkModalType(null));
        dispatch(updateForkModalData(null));
        dispatch(updateIsForkModalOpen(false));
        dispatch(resetFormModalError());
    };

    const handleSetWarning = () => {
        if (didLatestVersionChanged || versionNotFound) {
            if (didLatestVersionChanged) setWarningMsg(UPDATEGRAPH);
            if (versionNotFound) setWarningMsg(VERSIONNOTFOUND);
        } else {
            setWarningMsg(null);
        }
    };

    useEffect(() => {
        handleSetWarning();
    }, [didLatestVersionChanged, versionNotFound]);

    useEffect(() => {
        dispatch(updateForkModalData(null));

        dispatch(updateIsForkModalOpen(false));
    }, [selectedVersion]);

    useEffect(() => {
        return () => setWarningMsg(null);
    }, []);

    return (
        <TableAndJobsLayout
            type={type}
            handleNewForkModalOpen={handleNewForkModalOpen}
            handleCloseFormModal={handleCloseFormModal}
            isForkModalOpen={isForkModalOpen}
            allowClick={allowClick}
            handleOnClickRefresh={handleOnClickRefresh}
            warningMsg={warningMsg}
            recordsError={recordsError}
            forkId={forkId}
        />
    );
};

export default TableAndJobsLayoutController;
