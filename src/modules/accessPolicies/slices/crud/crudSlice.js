import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: null,
  openEditModal: false,
  EditModalData: {},
  tableEditModalData: {},
  searchedPolicy: null,
  editMe: [],
};

const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    updateActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    handleOpenEditModal: (state, action) => {
      state.openEditModal = (action && action.payload) || !state.openEditModal;
    },
    updateEditModalData: (state, action) => {
      state.EditModalData = action.payload;
    },
    updateTableEditModalData: (state, action) => {
      state.tableEditModalData = action.payload;
    },
    updateSearchedPolicy: (state, action) => {
      state.searchedPolicy = action.payload;
    },
    updateEditMe: (state, action) => {
      state.editMe = action.payload;
    },
  },
});

export const {
  updateActiveTab,
  updateEditModalData,
  handleOpenEditModal,
  updateTableEditModalData,
  updateSearchedPolicy,
  updateEditMe,
} = crudSlice.actions;

export const selectActiveTab = (state) => state.crud.activeTab;
export const selectOpenEditModal = (state) => state.crud.openEditModal;
export const selectEditModalData = (state) => state.crud.EditModalData;
export const selectTableModalData = (state) => state.crud.tableEditModalData;
export const selectSearchedPolicy = (state) => state.crud.searchedPolicy;
export const selectEditMe = (state) => state.crud.editMe;
export default crudSlice.reducer;
