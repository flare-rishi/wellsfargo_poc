//external libraries

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

//react components if there

//custom hooks

import DomainsAndDataSets from "./DomainsAndDataSets";

//utilities

import { replaceSpacesWithHyphens } from "../../../../utilities/utilities";

//redux slices

import { selectFilteredData, updateDataSetsList, updateFilteredData } from "../../slices/domainSlice/domainSlice";

// redux selectors

import {
    selectFilteredTableData,
    updateFilteredTableData,
    updateTables,
} from "../../slices/dataSetsSlice/dataSetsSlice";

//constants

import { DATASET, DOMAIN, LIST } from "../../../../constants/constants";
import { resetTabsState } from "../../../../slice/tabs/tabSlice";
import { resetAllTheStates, updateTableVersionData } from "../../slices/tableLevelSlice/tableLevelSlice";
import { resetUserGroupDropDown, updateUserGroup } from "../../../../slice/userSlices/userSlice";

//css files

const DomainsAndDataSetsController = ({ unFilteredList, type, screenLoading }) => {
    // State Hooks
    const [activeViewType, setActiveViewType] = useState(LIST);
    const [isSearchBarActive, setIsSearchBarActive] = useState(false);
    const [listData, setListData] = useState({});

    // React Router Hooks
    const location = useLocation();

    // Redux Hooks
    const dispatch = useDispatch();

    // Selectors
    const filteredData = useSelector(type === DOMAIN ? selectFilteredData : selectFilteredTableData);

    // Handlers
    const handleActiveViewType = (viewType) => setActiveViewType(viewType);

    // Effects
    useEffect(() => {
        setListData(Object.keys(filteredData).length > 0 ? filteredData : unFilteredList);
    }, [unFilteredList, location.pathname, filteredData]);

    useEffect(() => {
        dispatch(resetTabsState());
        dispatch(resetUserGroupDropDown());
        dispatch(updateTableVersionData({}));
        dispatch(resetAllTheStates());
        return () => {
            if (type === DOMAIN) {
                dispatch(updateFilteredData({}));
                dispatch(updateDataSetsList({}));
            } else if (type === DATASET) {
                dispatch(updateFilteredTableData({}));
                dispatch(updateTables({}));
            }
            dispatch(resetUserGroupDropDown());
            dispatch(resetAllTheStates());
        };
    }, [type, dispatch]);

    return (
        <DomainsAndDataSets
            listData={listData}
            type={type}
            activeViewType={activeViewType}
            handleActiveViewType={handleActiveViewType}
            unFilteredData={unFilteredList}
            replaceSpacesWithHyphens={replaceSpacesWithHyphens}
            pathName={location.pathname}
            isSearchBarActive={isSearchBarActive}
            setIsSearchBarActive={setIsSearchBarActive}
            screenLoading={screenLoading}
        />
    );
};

export default DomainsAndDataSetsController;
