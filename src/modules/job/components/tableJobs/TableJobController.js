import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchTableVersionsAsync } from "../../../dataDiscovery/slices/tableLevelSlice/tableThunk";
import {
  selectTableNotFound,
  updateHighlightTableCircle,
} from "../../../dataDiscovery/slices/tableLevelSlice/tableLevelSlice";
import TableJobs from "./TableJobs";
import { APIDAG, JOBVIEWTYPETABLE } from "../../../../constants/constants";
import useGetSearchParams from "../../../dataDiscovery/hooks/useLocationHooks/useGetSearchParams";
import ErrorPage from "../../../errorpages/ErrorPage";
import useNavigateToDataset from "../../../dataDiscovery/hooks/useLocationHooks/useNavigateToDataset";

const TableJobController = () => {
  const dispatch = useDispatch();
  const { domainName, dataSetName, tableName } = useParams();

  let { versionId, forkId } = useGetSearchParams();
  const navigateToDataset = useNavigateToDataset();

  const tableNotFound = useSelector(selectTableNotFound);

  useEffect(() => {
    dispatch(updateHighlightTableCircle(String(versionId)));
    dispatch(
      fetchTableVersionsAsync({
        domainName,
        dataSetName,
        tableName,
        versionId,
        forkId,
      })
    );
    console.log("dag rendered");
  }, []);

  useEffect(() => {
    if (tableNotFound) setNewPath(navigateToDataset);
  }, [tableNotFound]);
  // return <TableJobs type={JOBVIEWTYPETABLE} />;
  return tableNotFound ? (
    <ErrorPage link={newPath} />
  ) : (
    <TableJobs type={JOBVIEWTYPETABLE} />
  );
};

export default TableJobController;
