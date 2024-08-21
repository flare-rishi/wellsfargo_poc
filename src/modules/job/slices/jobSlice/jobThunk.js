import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDagsOfVerTable } from "./jobApi";
import { commonAPi } from "../../../dataDiscovery/slices/tableLevelSlice/tableApi";
import { APIDAG, APIJOB } from "../../../../constants/constants";
import { createCommonAsyncThunk } from "../../../dataDiscovery/slices/tableLevelSlice/tableThunk";

export const fetchDagsOfVerTableAsync = createCommonAsyncThunk("job/fetchDagsOfVerTable", fetchDagsOfVerTable);
export const fetchDagsJobVerTableAsync = createAsyncThunk(
    "job/fetchDagsJobVerTable",
    async ({ domainName, datasetName, tableName, versionId }, { rejectWithValue }) => {
        return commonAPi(APIJOB, domainName, datasetName, tableName, versionId)
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error.message));
    }
);
