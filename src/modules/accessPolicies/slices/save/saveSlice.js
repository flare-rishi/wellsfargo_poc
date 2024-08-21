import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unSavableTabs: 0,
  unSavableNodes: 0,
  editedNodes: [],
  editedTowers: [],
};

const saveSlice = createSlice({
  name: "save",
  initialState,
  reducers: {
    updateUnSavableTabs: (state, action) => {
      state.unSavableTabs = action.payload;
    },
    updateUnSavableNodes: (state, action) => {
      state.unSavableNodes = action.payload;
    },
    updateEditedNodes: (state, action) => {
      state.editedNodes = action.payload;
    },
    updateEditedTowers: (state, action) => {
      state.editedTowers = action.payload;
    },
    updateIsEdited: (state, action) => {
      state.isEdited = action.payload;
    },
  },
});

export const {
  updateUnSavableNodes,
  updateUnSavableTabs,
  updateEditedNodes,
  updateEditedTowers,
  updateIsEdited,
} = saveSlice.actions;

export const selectUnSavableNodes = (state) => state.save.unSavableNodes;
export const selectUnSavableTabs = (state) => state.save.unSavableTabs;
export const selectEditedNodes = (state) => state.save.editedNodes;
export const selectEditedTowers = (state) => state.save.editedTowers;
export const selectIsEdited = (state) => state.save.isEdited;

export default saveSlice.reducer;
