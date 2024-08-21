// src/features/data/dataThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchTableVersions,
    postApiForFork,
    fetchForkDetails,
    deleteForkApi,
    updateForkApi,
    fetchTableMetaData,
    fetchTableSchema,
    fetchQualityMetrics,
    fetchAdjustments,
    fetchExplore,
    fetchTablePath,
    fetchRows,
} from "./tableApi";
import { sortBasedDateAndConvertsJson } from "../../utilities/utilities";
import { SOMETHING_WENT_WRONG } from "../../../../constants/constants";

// async function  to fetch  the VERSIONS of a table

export const fetchTableVersionsAsync = createAsyncThunk(
    "table/fetchTableVersions",
    async ({ domainName, dataSetName, tableName }, {}) => {
        const versions = fetchTableVersions(domainName, dataSetName, tableName);
        let graphData = sortBasedDateAndConvertsJson(versions);
        return graphData;
    }
);

// create common AsyncThunk
export const createCommonAsyncThunk = (type, functionToFetch, aclsSlice = null) => {
    return createAsyncThunk(
        type,
        async ({ domainName, dataSetName, tableName, versionId, forkId }, { dispatch, getState, rejectWithValue }) => {
            const response = functionToFetch(domainName, dataSetName, tableName);
            return response;
        }
    );
};

// table description
export const fetchTableMetaDataAsync = createCommonAsyncThunk("table/fetchTableMetaData", fetchTableMetaData);

//table schema
export const fetchTableSchemaAsync = createCommonAsyncThunk("table/fetchTableSchema", fetchTableSchema);

//quality metrics
export const fetchQualityMetricsAsync = createCommonAsyncThunk("table/fetchQualityMetrics", fetchQualityMetrics);

export const fetchTableAdjustmentsAsync = createCommonAsyncThunk("table/fetchTableAdjustments", fetchAdjustments);

export const fetchTablePathAsync = createCommonAsyncThunk("table/fetchTablePath", fetchTablePath);

export const fetchTableExploreAsync = createCommonAsyncThunk("table/fetchTableExplore", fetchExplore);

export const fetchForkDetailsAsync = createCommonAsyncThunk("table/fetchForkDetails", fetchForkDetails);

//   record counts

export const fetchTableRecordsCountAsync = createAsyncThunk("table/fetchTableRecordsCount", fetchRows);

export const createForkAsync = createAsyncThunk(
    "table/createFork",
    async ({ domainName, dataSetName, tableName, versionId, body }, { rejectWithValue }) => {
        return postApiForFork(domainName, dataSetName, tableName, versionId, body)
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error.response.data));
    }
);

export const updateForkAsync = createAsyncThunk(
    "table/updateFork",
    async ({ domainName, dataSetName, tableName, versionId, forkId, body }, { rejectWithValue }) => {
        try {
            const response = await updateForkApi(domainName, dataSetName, tableName, versionId, forkId, body);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || SOMETHING_WENT_WRONG);
        }
    }
);

export const deleteForkAsync = createAsyncThunk(
    "table/deleteFork",
    async ({ domainName, dataSetName, tableName, versionId, forkId }, { rejectWithValue }) => {
        try {
            const response = await deleteForkApi(domainName, dataSetName, tableName, versionId, forkId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message || SOMETHING_WENT_WRONG);
        }
    }
);
