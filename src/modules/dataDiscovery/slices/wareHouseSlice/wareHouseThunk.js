import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWareHouses } from "./wareHouseAPI";

export const fetchWareHouseAsync = createAsyncThunk("table/fetchWareHouse", async (_, { rejectWithValue }) => {
    try {
        const wareHouseResponse = fetchWareHouses();
        return wareHouseResponse;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
