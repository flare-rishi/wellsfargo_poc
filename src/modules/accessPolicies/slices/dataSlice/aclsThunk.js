// src/features/data/dataThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostUpdatedAcls, fetchSelectedAcls } from "./aclsApi";

import { FETCH_ACLS, ACLS_DATA_JSON, ACLS_RESPONSE } from "../../../../constants/constants";

import { createCommonAsyncThunk } from "../../../dataDiscovery/slices/tableLevelSlice/tableThunk";
import toast from "react-hot-toast";

export const PostUpdatedAclsAsync = createAsyncThunk(
    "table/PostUpdatedAcls",
    async ({ jsonData, domainName, dataSetName, tableName, versionId, forkId }, { rejectWithValue }) => {
        try {
            console.log("body of request ", jsonData);
            const versions = await PostUpdatedAcls(jsonData, domainName, dataSetName, tableName, versionId, forkId);

            console.log("post response", versions);
            return versions.data;
        } catch (error) {
            let errorMsg = error.response?.data || error.message || SOMETHING_WENT_WRONG;
            toast.error(errorMsg);
            return rejectWithValue(errorMsg);
        }
    }
);

export const fetchSelectedAclsAsync = createCommonAsyncThunk("table/fetchSelectedAcls", fetchSelectedAcls, true);
