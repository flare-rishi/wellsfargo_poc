import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDagsOfVerTableAsync } from "../../slices/jobSlice/jobThunk";

import { useParams } from "react-router-dom";

import { APIDAG } from "../../../../constants/constants";
import useGetSearchParams from "../../../dataDiscovery/hooks/useLocationHooks/useGetSearchParams";

import DagsDisplay from "./DagsDisplay";

const DagsController = () => {
  const dispatch = useDispatch();
  const { domainName, dataSetName, tableName } = useParams();

  let { versionId, forkId } = useGetSearchParams();

  useEffect(() => {
    dispatch(
      fetchDagsOfVerTableAsync({
        APIDAG,
        domainName,
        dataSetName,
        tableName,
        versionId,
        forkId,
      })
    );
  }, [versionId, forkId]);

  return <DagsDisplay />;
};
export default DagsController;
