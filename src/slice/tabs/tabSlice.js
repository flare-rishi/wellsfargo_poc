import { createSlice } from "@reduxjs/toolkit";
import { NOOFROWS } from "../../constants/constants";

const initialState = {
  tabs: [],
  activeTab: null,
  noOfRows: NOOFROWS,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    updateTabs: (state, action) => {
      state.tabs = action.payload;
    },
    updateActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateNoOfRows: (state, action) => {
      state.noOfRows = action.payload;
    },
    resetTabsState: (state) => {
      (state.tabs = []), (state.activeTab = null), (state.noOfRows = NOOFROWS);
    },
  },
});

export const { updateTabs, updateActiveTab, resetTabsState, updateNoOfRows } =
  tabSlice.actions;

export const selectTabs = (state) => state.tab.tabs;
export const selectActiveTab = (state) => state.tab.activeTab;
export const selectNoOfRows = (state) => state.tab.noOfRows;

export default tabSlice.reducer;
