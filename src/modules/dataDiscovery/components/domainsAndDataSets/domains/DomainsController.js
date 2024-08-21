import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import DomainsAndDataSetsController from "../DomainsAndDataSetsController";

import {
  selectDataSetsList,
  selectDomainLoading,
  updateDataSetsList,
} from "../../../slices/domainSlice/domainSlice";

import { fetchAllDataSetsAsync } from "../../../slices/domainSlice/domainThunk";

import { DOMAIN } from "../../../../../constants/constants";

const DomainsController = () => {
  const { domainName } = useParams();

  const dispatch = useDispatch();

  const domainsScreenLoading = useSelector(selectDomainLoading);
  const dataSetsLists = useSelector(selectDataSetsList);

  useEffect(() => {
    dispatch(fetchAllDataSetsAsync(domainName));
    return () => {
      dispatch(updateDataSetsList({}));
    };
  }, []);

  return (
    <DomainsAndDataSetsController
      unFilteredList={dataSetsLists}
      type={DOMAIN}
      screenLoading={domainsScreenLoading}
    />
  );
};

export default DomainsController;
