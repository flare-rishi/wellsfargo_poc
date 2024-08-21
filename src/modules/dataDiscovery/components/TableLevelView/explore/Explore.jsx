import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Skeleton from "../../../../skeleton/Skeleton";

import { checkObjectIsValid } from "../../../../../utilities/utilities";

import {
    selectExploreData,
    selectExploreError,
    selectExploreLoading,
    updateTableExploreLoading,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import "./Explore.css";
import { APIEXPLORE, COLUMNNAMES, COLUMNS, DATA, EXPLORE, ROWS } from "../../../../../constants/constants";
import useGetSearchParams from "../../../hooks/useLocationHooks/useGetSearchParams";
import { fetchTableExploreAsync } from "../../../slices/tableLevelSlice/tableThunk";
import { useParams } from "react-router-dom";
import "./Explore.css";

import store from "../../../../../store/store";

const Explore = () => {
    const [table, setTable] = useState({});
    const { domainName, dataSetName, tableName } = useParams();

    let { versionId, forkId } = useGetSearchParams();

    const dispatch = useDispatch();
    const previewDetails = useSelector(selectExploreData);

    const loading = useSelector(selectExploreLoading);
    const noOfRows = useSelector(selectNoOfRows);

    const responseError = useSelector(selectExploreError);

    const convertToTable = () => {
        // let columns = ["name", "account", "state", "amount"];

        let columns = previewDetails[COLUMNNAMES];

        let updatedColumns = [];
        for (let i in columns) {
            let newObj;

            newObj = {
                field: columns[i],
                headerName: columns[i],
                width: columns.length === 1 ? 370 : 250,
            };

            updatedColumns.push(newObj);
        }

        const updatedPreviewDetails = previewDetails[DATA].map((data, index) => ({
            ...data,
            id: index,
        }));

        // const updatedPreviewDetails = previewDetails.map((data, index) => ({
        //     ...data,
        //     id: index,
        // }));

        setTable({ columns: updatedColumns, [ROWS]: updatedPreviewDetails });
    };

    const stateSizeInBytes = new TextEncoder().encode(JSON.stringify(store.getState())).length;
    const stateSizeInKB = stateSizeInBytes / 1024;
    const stateSizeInMB = stateSizeInKB / 1024;

    console.log(`Redux state size: ${stateSizeInMB} MB`);

    useEffect(() => {
        if (checkObjectIsValid(previewDetails)) convertToTable();
    }, [previewDetails, noOfRows]);

    useEffect(() => {
        dispatch(
            fetchTableExploreAsync({
                APIEXPLORE,
                domainName,
                dataSetName,
                tableName,
                versionId,
                forkId,
            })
        );
        // dispatch(updateTableExploreLoading(false));
    }, []);

    return loading ? (
        <Skeleton />
    ) : responseError ? (
        <TilesError msg={responseError} />
    ) : (
        checkObjectIsValid(table) && (
            <div className="explore-main-div">
                <div
                    style={{
                        maxWidth: "92vw",
                        width: "92vw",
                        overflow: "hidden",
                        height: "100%",
                        // alignItems: "center",
                    }}
                    className="data-grid-container"
                >
                    <Test rows={table?.[ROWS]} columns={table?.[COLUMNS]} />
                    {/* <ListView listData={table} /> */}
                </div>
            </div>
        )
    );
};

// delete test from here
//if usable then make a seperate component

import { createTheme, styled } from "@mui/material";

const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                footerContainer: {
                    minHeight: 30,
                    maxHeight: 30,
                    borderTop: "0.5px solid grey",
                },
                root: {
                    border: "none",
                },
                headerContainer: {
                    border: "none",
                },
                columnHeaders: {
                    borderBottom: "none",
                },
            },
        },
    },
});
//
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material";
import { selectNoOfRows } from "../../../../../slice/tabs/tabSlice";

import { Background } from "reactflow";
import TilesError from "../../../../../library/error/TilesError";
import ListView from "../../common/listView/ListView";

const CustomDataGrid = styled(DataGrid)({
    "& .MuiDataGrid-columnHeader": {
        position: "relative",
        backgroundColor: "var(--background-body)",
        color: "#374151",
    },
    "& .MuiDataGrid-menuIconButton": {
        visibility: "hidden",
    },
    "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIconButton": {
        visibility: "visible",
    },
    "& .MuiDataGrid-scrollbar": {
        visibility: "hidden",
    },
    "& .MuiDataGrid-scrollbar--vertical": {
        borderRadius: "50px",
        width: "10px",
    },

    "& .MuiDataGrid-scrollbar--horizontal": {
        height: "10px",
        borderRadius: "50px",
    },
    "&:hover .MuiDataGrid-scrollbar": {
        visibility: "visible",
    },
});

const Test = ({ rows, columns }) => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ height: "95%", width: "fit-content", maxWidth: "95%" }}>
                <CustomDataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15, 20]}
                    disableRowSelectionOnClick
                    rowHeight={30}
                    columnHeaderHeight={35}
                    showColumnVerticalBorder={false}
                />
            </Box>
        </ThemeProvider>
    );
};

export default Explore;
