import { createSlice } from "@reduxjs/toolkit";

import { fetchWareHouseAsync } from "./wareHouseThunk";
import { checkObjectIsValid } from "../../../../utilities/utilities";

const initialState = {
  domains: {},
  selectedWareHouse: null,
  wareHouseLoading: false,
  wareHouseError: null,
};

const wareHouseSlice = createSlice({
  name: "wareHouse",
  initialState,
  reducers: {
    updateDomains: (state, action) => {
      state.domains = action.payload;
    },
    updateSelectedWareHouse: (state, action) => {
      state.selectedWareHouse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWareHouseAsync.pending, (state) => {
        state.wareHouseLoading = true;
        state.wareHouseError = null;
      })
      .addCase(fetchWareHouseAsync.fulfilled, (state, action) => {
        state.wareHouseLoading = false;
        state.domains = action.payload;
        state.selectedWareHouse =
          checkObjectIsValid(action.payload) && Object.keys(action.payload)[0];
      })
      .addCase(fetchWareHouseAsync.rejected, (state, action) => {
        state.wareHouseLoading = false;
        state.wareHouseError = action.payload;
      });
  },
});

export const { updateDomains, updateSelectedWareHouse } =
  wareHouseSlice.actions;

export const selectDomains = (state) => state.wareHouse.domains;
export const selectWareHouseLoading = (state) =>
  state.wareHouse.wareHouseLoading;
export const selectSelectedWareHouse = (state) =>
  state.wareHouse.selectedWareHouse;

export default wareHouseSlice.reducer;
