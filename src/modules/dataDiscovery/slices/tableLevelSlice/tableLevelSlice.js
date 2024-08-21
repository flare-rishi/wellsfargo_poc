import { createSlice } from "@reduxjs/toolkit";
import {
    fetchTableMetaDataAsync,
    fetchTableSchemaAsync,
    fetchTableVersionsAsync,
    fetchQualityMetricsAsync,
    fetchTableAdjustmentsAsync,
    fetchTableExploreAsync,
    fetchTableRecordsCountAsync,
    createForkAsync,
    fetchTablePathAsync,
    fetchForkDetailsAsync,
    updateForkAsync,
    deleteForkAsync,
} from "./tableThunk";
import { COLUMNS, DASH, LASTFETCHED, PATH, TITLE } from "../../../../constants/constants";

const initialState = {
    highlightTableCircle: null,

    forkModalType: null,
    isForkModalOpen: false,
    forkModalData: null,
    tablePath: null,

    //records
    previousDates: DASH,
    nextDates: DASH,
    recordsApisPending: false,

    // data

    tableMetaData: {},
    tableVersionData: {},
    tableAdjustments: {},
    qualityMetricsData: {},
    recordsCountData: {},
    tableSchema: {},
    exploreData: {},
    versionIsValid: null,
    latestVersion: null,
    cacheRecordData: {},

    //loading

    tableLoading: false,
    versionGraphLoading: false,
    tableMetaDataLoading: false,
    tableSchemaLoading: false,
    recordsCountLoading: false,
    qualityMetricsLoading: false,
    tableAdjustmentsLoading: false,
    exploreLoading: false,
    versionIsValidLoading: false,
    createForkLoading: false,
    tablePathLoading: false,
    forkModalDataLoading: false,
    updateForkLoading: false,
    deleteForkLoading: false,
    //error

    versionGraphError: null,
    tableMetaDataError: null,
    tableSchemaError: null,
    recordsCountError: null,
    qualityMetricsError: null,
    tableAdjustmentsError: null,
    exploreError: null,
    versionIsValidError: null,
    versionNotFound: false,
    tableNotFound: false,
    didLatestVersionChanged: false,
    recordsError: {},
    createForkError: null,
    tablePathError: null,
    forkModalDataError: null,
    updateForkError: null,
    deleteForkError: null,

    //batch api
    areApisPending: false,
    allowClick: false,
    //query
    queryString: null,
};

const tableLevelSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        updateHighlightTableCircle: (state, action) => {
            state.highlightTableCircle = action.payload;
        },
        resetRecordsCount: (state) => {
            state.recordsCountData = {};
        },
        updateRecordCount: (state, action) => {
            state.recordsCountData = action.payload;
        },
        updateTableVersionData: (state, action) => {
            console.log("102 update tebal evrsion", action.payload);

            state.tableVersionData = action.payload;
        },
        updateAreApisPending: (state, action) => {
            state.areApisPending = action.payload;
        },
        updateAllowClick: (state, action) => {
            state.allowClick = action.payload;
        },
        updateLatestVersion: (state, action) => {
            state.latestVersion = action.payload;
        },
        updateVersionNotFound: (state, action) => {
            state.versionNotFound = action.payload;
        },
        updateTableNotFound: (state, action) => {
            state.tableNotFound = action.payload;
        },
        updateDidLatestVersionChanged: (state, action) => {
            state.didLatestVersionChanged = action.payload;
        },

        updateForkModalType: (state, action) => {
            state.forkModalType = action.payload;
        },
        updateIsForkModalOpen: (state, action) => {
            state.isForkModalOpen = action.payload;
        },
        updateForkModalData: (state, action) => {
            state.forkModalData = action.payload;
        },
        updateCacheRecords: (state, action) => {
            state.cacheRecordData = action.payload;
        },
        updateQuerystring: (state, action) => {
            state.queryString = action.payload;
        },
        updateTableSchema: (state, action) => {
            state.tableSchema = action.payload;
        },
        updateTableExplore: (state, action) => {
            state.exploreData = action.payload;
        },
        updateTableExploreLoading: (state, action) => {
            state.exploreLoading = action.payload;
        },
        resetAllTheStates: (state) => {
            state.tableMetaData = {};
            state.tableVersionData = {};
            state.tableAdjustments = {};
            state.qualityMetricsData = {};
            state.tableSchema = {};
            state.exploreData = {};
            state.recordsCountData = {};
            state.recordsCountLoading = true;
            state.latestVersion = null;
            state.didLatestVersionChanged = false;
            state.recordsError = {};
            state.tableNotFound = false;
            state.versionNotFound = false;
            state.didLatestVersionChanged = false;
            state.cacheRecordData = {};
            state.tablePath = null;
        },
        resetFormModalError: (state) => {
            state.tablePathError = null;
            state.forkModalDataError = null;
            state.createForkError = null;
            state.updateForkError = null;
            state.deleteForkError = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // versions of the table

            .addCase(fetchTableVersionsAsync.pending, (state) => {
                state.versionGraphLoading = true;
                state.versionGraphError = null;
                state.tableMetaDataLoading = true;
                state.tableSchemaLoading = true;
                state.recordsCountLoading = true;
                state.recordsApisPending = true;
                state.qualityMetricsLoading = true;
                state.tableAdjustmentsLoading = true;
                state.exploreLoading = true;
            })
            .addCase(fetchTableVersionsAsync.fulfilled, (state, action) => {
                state.versionGraphLoading = false;

                console.log("192 ", action.payload);

                state.tableVersionData = action.payload;
                state.latestVersion = action.payload.latestVersion;
            })
            .addCase(fetchTableVersionsAsync.rejected, (state, action) => {
                state.versionGraphLoading = false;
                state.versionGraphError = action.payload;
                state.exploreLoading = false;
                state.tableVersionData = {};
                state.tableMetaDataLoading = false;
                state.tableSchemaLoading = false;
                state.recordsCountLoading = false;
                state.recordsApisPending = false;
                state.qualityMetricsLoading = false;
                state.tableAdjustmentsLoading = false;
            })

            // metaData of the table

            .addCase(fetchTableMetaDataAsync.pending, (state) => {
                state.tableMetaDataLoading = true;
                state.tableMetaDataError = null;
            })
            .addCase(fetchTableMetaDataAsync.fulfilled, (state, action) => {
                state.tableMetaDataLoading = false;
                state.tableMetaData = action.payload;
            })
            .addCase(fetchTableMetaDataAsync.rejected, (state, action) => {
                state.tableMetaDataLoading = false;
                state.tableMetaDataError = action.payload;
                state.tableMetaData = {};
            })

            // schema of the table

            .addCase(fetchTableSchemaAsync.pending, (state) => {
                state.tableSchemaLoading = true;
                state.tableSchemaError = null;
            })
            .addCase(fetchTableSchemaAsync.fulfilled, (state, action) => {
                state.tableSchemaLoading = false;
                state.tableSchema = action.payload;
            })
            .addCase(fetchTableSchemaAsync.rejected, (state, action) => {
                state.tableSchemaLoading = false;
                state.tableSchemaError = action.payload;
                state.tableSchema = {};
            })

            // records count of schema of the table

            .addCase(fetchTableRecordsCountAsync.pending, (state) => {
                state.recordsCountLoading = true;
                state.recordsCountError = null;
                state.recordsApisPending = true;
            })
            .addCase(fetchTableRecordsCountAsync.fulfilled, (state, action) => {
                console.log(" action of the records count ", action.payload);
                state.recordsCountData = action.payload.rows;
                state.recordsApisPending = false;
                state.recordsCountLoading = false;

                state.previousDates = action.payload.dates?.previousDate;
                state.nextDates = action.payload?.dates.nextDate;
                // state.recordsError = action.payload[versionId].data.errors;
                // state.recordsCountLoading = false;
                // state.recordsApisPending = false;
                // state.cacheRecordData = action.payload;
            })
            .addCase(fetchTableRecordsCountAsync.rejected, (state, action) => {
                state.recordsCountLoading = false;
                state.recordsCountError = action.payload;
                state.previousDates = DASH;
                state.nextDates = DASH;
                state.recordsApisPending = false;
            })
            // quality metrics

            .addCase(fetchQualityMetricsAsync.pending, (state) => {
                state.qualityMetricsLoading = true;
                state.qualityMetricsError = null;
            })
            .addCase(fetchQualityMetricsAsync.fulfilled, (state, action) => {
                state.qualityMetricsLoading = false;

                state.qualityMetricsData = action.payload;
            })
            .addCase(fetchQualityMetricsAsync.rejected, (state, action) => {
                state.qualityMetricsLoading = false;
                state.qualityMetricsError = action.payload;
                state.qualityMetricsData = {};
            })

            // table adjustments

            .addCase(fetchTableAdjustmentsAsync.pending, (state) => {
                state.tableAdjustmentsLoading = true;
                state.tableAdjustmentsError = null;
            })
            .addCase(fetchTableAdjustmentsAsync.fulfilled, (state, action) => {
                state.tableAdjustmentsLoading = false;
                state.tableAdjustments = action.payload;
            })
            .addCase(fetchTableAdjustmentsAsync.rejected, (state, action) => {
                state.tableAdjustmentsLoading = false;
                state.tableAdjustmentsError = action.payload;
                state.tableAdjustments = {};
            })
            // table explore

            .addCase(fetchTableExploreAsync.pending, (state) => {
                state.exploreLoading = true;
                state.exploreError = null;
            })
            .addCase(fetchTableExploreAsync.fulfilled, (state, action) => {
                state.exploreLoading = false;
                state.exploreData = action.payload;
            })
            .addCase(fetchTableExploreAsync.rejected, (state, action) => {
                state.exploreLoading = false;
                state.exploreError = action.payload;
                state.exploreData = {};
            })

            //create fork

            .addCase(createForkAsync.pending, (state) => {
                state.createForkLoading = true;
                state.createForkError = null;
            })
            .addCase(createForkAsync.fulfilled, (state, action) => {
                state.createForkLoading = false;
            })
            .addCase(createForkAsync.rejected, (state, action) => {
                state.createForkLoading = false;
                state.createForkError = action.payload;
            })

            //fetch table path

            .addCase(fetchTablePathAsync.pending, (state) => {
                state.tablePathLoading = true;
                state.tablePathError = null;
            })
            .addCase(fetchTablePathAsync.fulfilled, (state, action) => {
                state.tablePathLoading = false;
                state.tablePath = action.payload;
            })
            .addCase(fetchTablePathAsync.rejected, (state, action) => {
                state.tablePathLoading = false;
                state.tablePathError = action.payload;
            })

            //fetch fork details

            .addCase(fetchForkDetailsAsync.pending, (state) => {
                state.forkModalDataLoading = true;
                state.forkModalDataError = null;
            })
            .addCase(fetchForkDetailsAsync.fulfilled, (state, action) => {
                state.forkModalDataLoading = false;
                state.forkModalData = action.payload;
            })
            .addCase(fetchForkDetailsAsync.rejected, (state, action) => {
                state.forkModalDataLoading = false;
                state.forkModalDataError = action.payload;
            })

            //update fork details

            .addCase(updateForkAsync.pending, (state) => {
                state.updateForkLoading = true;
                state.updateForkError = null;
            })
            .addCase(updateForkAsync.fulfilled, (state) => {
                state.updateForkLoading = false;
            })
            .addCase(updateForkAsync.rejected, (state, action) => {
                state.updateForkLoading = false;
                state.updateForkError = action.payload;
            })

            //delete fork
            .addCase(deleteForkAsync.pending, (state) => {
                state.deleteForkLoading = true;
                state.deleteForkError = null;
            })
            .addCase(deleteForkAsync.fulfilled, (state) => {
                state.deleteForkLoading = false;
            })
            .addCase(deleteForkAsync.rejected, (state, action) => {
                state.deleteForkLoading = false;
                state.deleteForkError = action.payload;
            });
    },
});

export const {
    updateHighlightTableCircle,
    updateRecordCount,
    resetRecordsCount,
    updateTableVersionData,
    resetAllTheStates,
    updateAreApisPending,
    updateAllowClick,
    updateLatestVersion,
    updateIsForkModalOpen,
    updateForkModalData,
    updateTableNotFound,
    updateVersionNotFound,
    updateDidLatestVersionChanged,
    updateCacheRecords,
    updateQuerystring,
    updateForkModalType,
    updateTableSchema,
    updateTableExplore,
    resetFormModalError,
    updateTableExploreLoading,
} = tableLevelSlice.actions;

export const selectTableMetaData = (state) => state.table.tableMetaData;
export const selectLatestVersion = (state) => state.table.latestVersion;
export const selectForkModalType = (state) => state.table.forkModalType;

export const selectHighlightTableCircle = (state) => state.table.highlightTableCircle;
export const selectTableVersionData = (state) => state.table.tableVersionData["versions"];
export const selectTableVersionLastFetched = (state) => state.table.tableVersionData[LASTFETCHED];
export const selectTableAdjustments = (state) => state.table.tableAdjustments;

export const selectRecordsCountData = (state) => state.table.recordsCountData;
export const selectTableSchema = (state) => state.table.tableSchema;
export const selectExploreData = (state) => state.table.exploreData;
export const selectQualityMetricsData = (state) => state.table.qualityMetricsData;
export const selectTableLoading = (state) => state.table.tableLoading;

export const selectTableSchemaLoading = (state) => state.table.tableSchemaLoading;

export const selectCreateForkLoading = (state) => state.table.createForkLoading;
export const selectIsForkModalOpen = (state) => state.table.isForkModalOpen;
export const selectForkModalData = (state) => state.table.forkModalData;
export const selectTablePath = (state) => state.table.tablePath?.path;

// exports loading

export const selectVersionGraphLoading = (state) => state.table.versionGraphLoading;

export const selectSchemaLoading = (state) => state.table.tableSchemaLoading;

export const selectRecordsCountLoading = (state) => state.table.recordsCountLoading;

export const selectTableMetaDataLoading = (state) => state.table.tableMetaDataLoading;

export const selectQualityMetricsLoading = (state) => state.table.qualityMetricsLoading;

export const selectExploreLoading = (state) => state.table.exploreLoading;

export const selectTableAdjustmentsLoading = (state) => state.table.tableAdjustmentsLoading;

export const selectTablePathLoading = (state) => state.table.tablePathLoading;

export const selectForkModalDataLoading = (state) => state.table.forkModalDataLoading;

export const selectUpdateForkLoading = (state) => state.table.updateForkLoading;

export const selectDeleteForkLoading = (state) => state.table.deleteForkLoading;

// exports errors

export const selectVersionGraphError = (state) => state.table.versionGraphError;

export const selectSchemaError = (state) => state.table.tableSchemaError;

export const selectRecordsCountError = (state) => state.table.recordsCountError;

export const selectExploreError = (state) => state.table.exploreError;

export const selectQualityMetricsError = (state) => state.table.qualityMetricsError;

export const selectAdjustmentsError = (state) => state.table.tableAdjustmentsError;

export const selectTableMetaDataError = (state) => state.table.tableMetaDataError;

export const selectTableAdjustmentError = (state) => state.table.tableAdjustmentsError;

export const selectCreateForkError = (state) => state.table.createForkError;

export const selectForkModalError = (state) => state.table.forkModalDataError;

export const selectTablePathError = (state) => state.table.tablePathError;

export const selectUpdateForkError = (state) => state.table.updateForkError;

export const selectDeleteForkError = (state) => state.table.deleteForkError;

//records
export const selectAreApisPending = (state) => state.table.areApisPending;
export const selectPreviousDates = (state) => state.table.previousDates;
export const selectNextDates = (state) => state.table.nextDates;
export const selectRecordsError = (state) => state.table.recordsError;

//allow click
export const selectAllowCLick = (state) => state.table.allowClick;

//version and table not found
export const selectTableNotFound = (state) => state.table.tableNotFound;
export const selectVersionNotFound = (state) => state.table.versionNotFound;
export const selectDidLatestVersionChanged = (state) => state.table.didLatestVersionChanged;

// export query string

export const selectQueryString = (state) => state.table.queryString;

//export slice
export default tableLevelSlice.reducer;
