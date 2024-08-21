import React, { useEffect, useRef, useState } from "react";

import SearchBox from "./SearchBox";

import useGetSearchData from "../../../hooks/searchHooks/useGetSearchData";

import {
  DATASET,
  DATASETFILTERS,
  DESCRIPTION,
  DOMAIN,
  TABLE,
  TABLELEVELFILTERS,
} from "../../../../../constants/constants";
import useSearchHook from "../../../hooks/searchHooks/useSearchHook";

const SearchBoxController = ({
  type,
  unFilteredData,
  replaceSpacesWithHyphens,
  pathName,
  isSearchBarActive,
  setIsSearchBarActive,
  screenLoading,
}) => {
  const [filterTabs, setFilterTabs] = useState([]);
  const [activeFilterTab, setActiveFilterTab] = useState("");
  const [tabsDetailedData, setTabsDetailedData] = useState({});
  const [searchInput, setSearchInput] = useState("");

  const getSearchData = useGetSearchData();
  const useSearch = useSearchHook();

  // updates the tabs based upon the type (domain/ dataset)
  function updateFilters() {
    if (type === DOMAIN) {
      setFilterTabs(DATASETFILTERS);
    } else if (type === DATASET) {
      setFilterTabs(TABLELEVELFILTERS);
    }
  }

  //function  to set active tab

  const handleSetFilters = (tabName) => {
    setActiveFilterTab(tabName);
  };

  const handleOnSearchInputChange = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
    setSearchInput(event.target.value);
  };

  // onclick

  const handleClickOnSuggestions = (inputSearch) => {
    let query;
    if (activeFilterTab === DESCRIPTION) {
      query = inputSearch.DESCRIPTION;
    } else if (activeFilterTab === TABLE) {
      query = inputSearch[TABLE];
    } else {
      query = inputSearch;
    }
    setSearchInput(query);
    useSearch(activeFilterTab, unFilteredData, query, type);
    setIsSearchBarActive(false);
  };

  // this function handles the submit  and

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = () => {
    useSearch(activeFilterTab, unFilteredData, searchInput.trim(), type);
    setIsSearchBarActive(false);
  };

  //this  useEffect runs every time when user enters an input
  // and is responsible for the suggestions below the search and filters out based on the input

  useEffect(() => {
    if (isSearchBarActive) {
      const values = getSearchData(
        activeFilterTab,
        unFilteredData,
        searchInput.trim()
      );
      setTabsDetailedData(values);
    }
  }, [activeFilterTab, unFilteredData, searchInput, isSearchBarActive]);

  // this useEffect updates the filters tabs based upon the datasets and tables

  useEffect(() => {
    updateFilters();
  }, [type]);

  // this useEffect updates the active  filters tab to 0 index that is name

  useEffect(() => {
    setActiveFilterTab(filterTabs[0]);
  }, [filterTabs]);

  const containerRef = useRef(null);

  // this useEffect is responsible for closing the search div when user clicks outside the div

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsSearchBarActive(false);
        // handleSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSearchBarActive]);

  return (
    <SearchBox
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      filterTabs={filterTabs}
      handleSetFilters={handleSetFilters}
      activeFilterTab={activeFilterTab}
      type={type}
      tabsDetailedData={tabsDetailedData}
      handleOnSearchInputChange={handleOnSearchInputChange}
      replaceSpacesWithHyphens={replaceSpacesWithHyphens}
      pathName={pathName}
      handleSearchSubmit={handleSearchSubmit}
      isSearchBarActive={isSearchBarActive}
      setIsSearchBarActive={setIsSearchBarActive}
      containerRef={containerRef}
      handleClickOnSuggestions={handleClickOnSuggestions}
      screenLoading={screenLoading}
    />
  );
};

export default SearchBoxController;
