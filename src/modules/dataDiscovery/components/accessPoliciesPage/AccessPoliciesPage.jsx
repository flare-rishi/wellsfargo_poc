import React, { useEffect, useState } from "react";
import AccessPolicies from "../../../accessPolicies/components/access-policies/AccessPolicies";
import useNavigateToDataset from "../../hooks/useLocationHooks/useNavigateToDataset";
import ErrorPage from "../../../errorpages/ErrorPage";
import { useDispatch, useSelector } from "react-redux";
import { selectTableNotFound, updateQuerystring } from "../../slices/tableLevelSlice/tableLevelSlice";
import useGetSearchParams from "../../hooks/useLocationHooks/useGetSearchParams";
import { useParams } from "react-router-dom";
import { selectAclDataJson } from "../../../accessPolicies/slices/dataSlice/dataSlice";

const AccessPoliciesPage = () => {
    const [newPath, setPath] = useState();
    const navigateToDataSet = useNavigateToDataset();
    const { domainName, dataSetName, tableName } = useParams();

    const dispatch = useDispatch();
    let { versionId, forkId } = useGetSearchParams();

    const tableNotFound = useSelector(selectTableNotFound);

    useEffect(() => {
        let queryString = domainName + dataSetName + tableName + "-" + versionId;
        if (forkId) {
            queryString += forkId;
        }
        dispatch(updateQuerystring(queryString));
    }, [versionId, forkId]);

    useEffect(() => {
        if (tableNotFound) setPath(navigateToDataSet());
    }, [tableNotFound]);

    return tableNotFound ? <ErrorPage link={newPath} /> : <AccessPolicies />;
};

export default AccessPoliciesPage;
