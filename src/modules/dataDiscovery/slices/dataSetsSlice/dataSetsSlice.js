import { createSlice } from "@reduxjs/toolkit";
import { fetchAllTablesAsync } from "./dataSetsThunk";

const initialState = {
  tables: {},
  selectedTable: null,
  filteredTableData: {},
  dataSetLoading: false,
  dataSetError: null,
};

const dataSetSlice = createSlice({
  name: "dataSet",
  initialState,
  reducers: {
    updateTables: (state, action) => {
      state.tables = action.payload;
    },
    updateFilteredTableData: (state, action) => {
      state.filteredTableData = action.payload;
    },
    updateSelectedTable: (state, action) => {
      state.selectedDatSets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTablesAsync.pending, (state) => {
        state.dataSetLoading = true;
        state.dataSetError = null;
      })
      .addCase(fetchAllTablesAsync.fulfilled, (state, action) => {
        state.dataSetLoading = false;
        state.tables = action.payload;
      })
      .addCase(fetchAllTablesAsync.rejected, (state, action) => {
        state.dataSetLoading = false;
        state.dataSetError = action.payload;
        state.tables = {};
      });
  },
});

export const { updateTables, updateSelectedTable, updateFilteredTableData } =
  dataSetSlice.actions;

export const selectTablesList = (state) => state.dataSet.tables;
export const selectFilteredTableData = (state) =>
  state.dataSet.filteredTableData;
export const selectSelectedTable = (state) => state.dataSet.selectedTable;
export const selectDataSetLoading = (state) => state.dataSet.dataSetLoading;

export default dataSetSlice.reducer;
