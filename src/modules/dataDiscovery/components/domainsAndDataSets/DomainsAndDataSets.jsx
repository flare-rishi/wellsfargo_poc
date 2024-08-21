import React from "react";

import SearchBoxController from "../common/searchBox/SearchBoxController";
import Skeleton from "../../../skeleton/Skeleton";
import Filters from "./filters/Filters";
import ListView from "../common/listView/ListView";
import GridView from "../common/gridView/GridView";

import { checkObjectIsValid } from "../../../../utilities/utilities";

import { GRID, LIST } from "../../../../constants/constants";

import "./DomainAndDataSets.css";

const DomainsAndDataSets = ({
    listData,
    type,
    activeViewType,
    handleActiveViewType,
    unFilteredData,
    replaceSpacesWithHyphens,
    pathName,
    isSearchBarActive,
    setIsSearchBarActive,
    screenLoading,
}) => {
    return (
        <div className="detailed-view-main">
            <SearchBoxController
                listData={listData}
                type={type}
                unFilteredData={unFilteredData}
                replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                pathName={pathName}
                isSearchBarActive={isSearchBarActive}
                setIsSearchBarActive={setIsSearchBarActive}
                screenLoading={screenLoading}
            />

            <Filters type={type} activeViewType={activeViewType} handleActiveViewType={handleActiveViewType} />

            <div
                className={`view-main-div-dataset div-background-border ${
                    activeViewType == GRID ? "remove-background-color" : ""
                }`}
            >
                {screenLoading ? (
                    <Skeleton />
                ) : (
                    checkObjectIsValid(listData) && (
                        <ListOrGridView
                            listData={listData}
                            replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                            pathName={pathName}
                            activeViewType={activeViewType}
                            type={type}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default DomainsAndDataSets;

//  list or grid view component

const ListOrGridView = ({ activeViewType, listData, replaceSpacesWithHyphens, pathName, type }) => {
    switch (activeViewType) {
        case GRID:
            return (
                <GridView
                    listData={listData}
                    replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                    pathName={pathName}
                    type={type}
                />
            );
        case LIST:
            return (
                <ListView listData={listData} replaceSpacesWithHyphens={replaceSpacesWithHyphens} pathName={pathName} />
            );
    }
};
