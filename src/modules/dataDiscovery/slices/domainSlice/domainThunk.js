import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllDataSets } from "./domainApi";

export const fetchAllDataSetsAsync = createAsyncThunk(
    "table/fetchAllDataSets",
    async (domainName, { rejectWithValue }) => {
        try {
            const dataSetsResponse = fetchAllDataSets(domainName);
            return dataSetsResponse;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
