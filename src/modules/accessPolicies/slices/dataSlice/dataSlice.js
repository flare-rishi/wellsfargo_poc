import { createSlice } from "@reduxjs/toolkit";
import { fetchSelectedAclsAsync } from "./aclsThunk";

const initialState = {
    dataJson: {},
    uniqueNodeNames: [],
    uniqueTowerNames: [],
    towers: [],
    isSplitViewOpen: false,
    splitViewData: {},
    textEditor: false,
    aclDataJson: {},
    textEditorData: "",
    deletedColumns: ["state"],
    aclsLoading: false,
    aclsError: null,
};

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        updateTextEditor: (state, action) => {
            state.textEditor = action.payload;
        },
        updateDeletedColumns: (state, action) => {
            state.deletedColumns = action.payload;
        },
        updateTextEditorData: (state, action) => {
            state.textEditorData = action.payload;
        },
        updateData: (state, action) => {
            state.dataJson = action.payload;
        },

        updateUniquesNodeNames: (state, action) => {
            state.uniqueNodeNames = action.payload;
        },
        updateUniquesTowerNames: (state, action) => {
            state.uniqueTowerNames = action.payload;
        },
        updateTowers: (state, action) => {
            state.towers = action.payload;
        },
        updateSplitView: (state, action) => {
            state.isSplitViewOpen = action.payload;
        },
        updateAclJsonData: (state, action) => {
            state.aclDataJson = action.payload;
        },
        updateSplitViewData: (state, action) => {
            state.splitViewData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSelectedAclsAsync.pending, (state) => {
                state.aclsLoading = true;
                state.aclsError = null;
            })
            .addCase(fetchSelectedAclsAsync.fulfilled, (state, action) => {
                state.aclsLoading = false;

                // state.dataJson = action.payload.acls;
                // state.textEditorData = JSON.stringify(action.payload.acls, null, 2);
            })
            .addCase(fetchSelectedAclsAsync.rejected, (state, action) => {
                state.aclsLoading = false;
                state.aclsError = action.payload;
            });
    },
});

export const {
    updateData,
    updateUniquesNodeNames,
    updateUniquesTowerNames,
    updateTowers,
    updateSplitView,
    updateSplitViewData,
    updateTextEditor,
    updateAclJsonData,
    updateTextEditorData,
    updateDeletedColumns,
} = dataSlice.actions;

export const selectData = (state) => state.data.dataJson;
export const selectUniqueNodeNames = (state) => state.data.uniqueNodeNames;
export const selectUniqueTowerNames = (state) => state.data.uniqueTowerNames;
export const selectTowers = (state) => state.data.towers;
export const selectIsSplitViewOpen = (state) => state.data.isSplitViewOpen;
export const selectSplitViewData = (state) => state.data.splitViewData;
export const selectTextEditor = (state) => state.data.textEditor;
export const selectAclDataJson = (state) => state.data.aclDataJson;
export const selectTextEditorData = (state) => state.data.textEditorData;
export const selectDeletedColumns = (state) => state.data.deletedColumns;
export const selectAclsLoading = (state) => state.data.aclsLoading;
export const selectAclsError = (state) => state.data.aclsError;

export default dataSlice.reducer;
