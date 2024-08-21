import React from "react";
import { IoSearchSharp } from "react-icons/io5";

import DisplayTabDetails from "./DisplayTabDetails";

import {
  DATASET,
  DOMAIN,
  GENERATIONS,
  TABLE,
} from "../../../../../constants/constants";

import "./SearchBox.css";

const SearchBox = ({
  searchInput,
  filterTabs,
  handleSetFilters,
  activeFilterTab,
  type,
  tabsDetailedData,
  handleOnSearchInputChange,
  replaceSpacesWithHyphens,
  pathName,
  handleSearchSubmit,
  isSearchBarActive,
  setIsSearchBarActive,
  containerRef,
  handleClickOnSuggestions,
}) => {
  return (
    <>
      {isSearchBarActive && <div className="overlay-background"></div>}

      <div className="search-input-container" ref={containerRef}>
        <input
          className="search-input"
          type="text"
          placeholder={`${
            (type === DOMAIN && "Search Dataset") ||
            (type === DATASET && "Search Tables")
          } `}
          value={searchInput}
          onChange={(e) => {
            handleOnSearchInputChange(e);
          }}
          onFocus={(e) => setIsSearchBarActive(true)}
        />

        {isSearchBarActive && (
          <div className="search-dropdown">
            <div className="search-dropdown-tabs">
              {filterTabs &&
                filterTabs.length > 0 &&
                filterTabs.map((tabName, index) => (
                  <p
                    onClick={() => handleSetFilters(tabName)}
                    className={`search-dropdown-tab ${
                      activeFilterTab === tabName &&
                      "search-dropdown-active-tab"
                    }`}
                    key={index}
                  >
                    {tabName}
                  </p>
                ))}
            </div>
            {tabsDetailedData?.length > 0 && (
              <div className="search-dropdown-name-list">
                {tabsDetailedData.map((tabDetails, index) => {
                  return (
                    <div
                      className="search-dropdown-name-list-inner-div"
                      onClick={() => handleClickOnSuggestions(tabDetails)}
                      key={index}
                    >
                      <DisplayTabDetails
                        tabDetails={tabDetails}
                        activeFilterTab={activeFilterTab}
                        replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                        pathName={pathName}
                        versionId={tabDetails?.[GENERATIONS] || null}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <IoSearchSharp
          className="search-input-icon"
          onClick={(e) => handleSearchSubmit(e)}
        />
      </div>
    </>
  );
};

export default SearchBox;
