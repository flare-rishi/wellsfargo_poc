import { createSlice } from "@reduxjs/toolkit";
import { fetchAllDataSetsAsync } from "./domainThunk";

const initialState = {
    dataSets: {},
    selectedDatSets: null,
    filteredData: {},
    domainsLoading: false,
    domainsError: null,
};

export const fetchTablesList = () => {};

const domainSlice = createSlice({
    name: "domain",
    initialState,
    reducers: {
        updateDataSetsList: (state, action) => {
            state.dataSets = action.payload;
        },
        updateFilteredData: (state, action) => {
            state.filteredData = action.payload;
        },
        updateSelectedDataSets: (state, action) => {
            state.selectedDatSets = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDataSetsAsync.pending, (state) => {
                state.domainsLoading = true;
                state.domainsError = null;
                state.dataSets = {};
            })
            .addCase(fetchAllDataSetsAsync.fulfilled, (state, action) => {
                state.domainsLoading = false;
                state.dataSets = action.payload;
                state.domainsError = null;
            })
            .addCase(fetchAllDataSetsAsync.rejected, (state, action) => {
                state.domainsLoading = false;
                state.domainsError = action.payload;
                state.dataSets = {};
            });
    },
});

export const { updateDataSetsList, updateSelectedDataSets, updateFilteredData } = domainSlice.actions;

export const selectDataSetsList = (state) => state.domain.dataSets;
export const selectFilteredData = (state) => state.domain.filteredData;
export const selectSelectedDataSet = (state) => state.domain.selectedDatSets;
export const selectDomainLoading = (state) => state.domain.domainsLoading;

export default domainSlice.reducer;
