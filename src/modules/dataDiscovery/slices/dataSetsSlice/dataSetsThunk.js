import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllTables } from "./dataSetsApi";

export const fetchAllTablesAsync = createAsyncThunk(
    "table/fetchAllTables",
    async ({ domainName, dataSetName }, { rejectWithValue }) => {
        try {
            const TablesResponse = fetchAllTables(domainName, dataSetName);
            return TablesResponse;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
