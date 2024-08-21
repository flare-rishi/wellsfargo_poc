import React, { useEffect, useState } from "react";
import Breadcrumb from "./BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import {
    DATA,
    EXCLUDEBREADCRUMBS,
    FILTER,
    FORKID,
    INTERTOWER,
    MASKS,
    PII,
    PIIVISIBILITY,
    REPLACEROUTES,
    TOWERS,
    VERSIONID,
} from "../../../../constants/constants";
import { useSelector } from "react-redux";
import { selectAclDataJson, selectData } from "../../../accessPolicies/slices/dataSlice/dataSlice";
import { checkObjectIsValid } from "../../../../utilities/utilities";
import { selectQueryString } from "../../slices/tableLevelSlice/tableLevelSlice";
import useConvertToOriginalJson from "../../../accessPolicies/hooks/useConvertToOriginal/useConvertToOriginal";

import { selectActiveTab } from "../../../../slice/tabs/tabSlice";

const BreadCrumbsController = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location.pathname;
    const queryString = location.search;
    const replaceRoutes = REPLACEROUTES;

    const activeTab = useSelector(selectActiveTab);

    // Splitting the pathname into parts
    const breads = pathName.split("/").filter((bread) => bread !== "");

    // Handling the case to exclude breadcrumbs for certain paths
    if (EXCLUDEBREADCRUMBS.includes(pathName)) {
        return null; // Don't display breadcrumbs for these paths
    }

    const breadcrumbs = breads.map((bread, index) => {
        const routeTo = `/${breads.slice(0, index + 1).join("/")}`;

        if (EXCLUDEBREADCRUMBS.includes(bread)) {
            return null; // Exclude breadcrumbs based on EXCLUDEBREADCRUMBS array
        }

        const isLast = index === breads.length - 1;

        // Check if the breadcrumb is for the tableName, which we assume is the second last part
        const isTableName = breads.length > 5 ? index === breads.length - 2 : index === breads.length - 1;

        const urlParams = new URLSearchParams(queryString);
        const versionId = urlParams.get(VERSIONID);
        const forkId = urlParams.get(FORKID);
        let breadcrumbText = bread;
        if (isTableName && versionId) {
            breadcrumbText += `-${versionId}${forkId ? `-${forkId}` : ""}`;
        }

        return isLast ? (
            <Typography key={bread} color="#dd1e25">
                {breadcrumbText}
            </Typography>
        ) : (
            <Link key={bread} color="inherit" underline="hover" onClick={(event) => handleClick(event, routeTo)}>
                {breadcrumbText}
            </Link>
        );
    });

    function handleClick(event, routeTo) {
        event.preventDefault();
        let route;
        let bread = routeTo.split("/");

        if (bread.length === 3) {
            route = `/${bread[1]}`;
        } else {
            route = routeTo;
        }

        const shouldReplaceRoute = replaceRoutes.some((replaceRoute) => route.includes(replaceRoute));

        const newRoute = shouldReplaceRoute ? route.replace(new RegExp(replaceRoutes.join("|")), DATA) : route;

        navigate(queryString && bread.length === 6 ? `${newRoute}${queryString}` : newRoute);
    }

    return (
        <div>
            <Breadcrumb breadcrumbs={breadcrumbs} activeTab={activeTab} />
        </div>
    );
};

export default BreadCrumbsController;
