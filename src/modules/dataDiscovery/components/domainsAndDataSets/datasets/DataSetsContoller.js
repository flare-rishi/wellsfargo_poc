import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import DomainsAndDataSetsController from "../DomainsAndDataSetsController";

import {
  selectDataSetLoading,
  selectTablesList,
  updateTables,
} from "../../../slices/dataSetsSlice/dataSetsSlice";

import { fetchAllTablesAsync } from "../../../slices/dataSetsSlice/dataSetsThunk";

import { DATASET } from "../../../../../constants/constants";

const DataSetsController = () => {
  const { domainName, dataSetName } = useParams();

  const dispatch = useDispatch();

  const dataSetLoading = useSelector(selectDataSetLoading);
  const tablesList = useSelector(selectTablesList);

  useEffect(() => {
    dispatch(fetchAllTablesAsync({ domainName, dataSetName }));
  }, []);

  useEffect(() => {
    return () => {
      //clean up function to clear the redux state
      dispatch(updateTables({}));
    };
  }, []);

  return (
    <DomainsAndDataSetsController
      unFilteredList={tablesList}
      type={DATASET}
      screenLoading={dataSetLoading}
    />
  );
};

export default DataSetsController;
