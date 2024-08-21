import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flowData: {},
  displaynodes: {},
  selectedNodes: [],
  tempRecord: {},
  flowPosition: {},
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    updateSelectedNodes: (state, action) => {
      state.selectedNodes = action.payload;
    },
    updateFlowData: (state, action) => {
      state.flowData = action.payload;
    },
    updateDisplayNodes: (state, action) => {
      state.displaynodes = action.payload;
    },
    updateTempRecord: (state, action) => {
      state.tempRecord = action.payload;
    },
    updateFlowPosition: (state, action) => {
      state.flowPosition = action.payload;
    },
  },
});

export const {
  updateFlowData,
  updateDisplayNodes,
  updateSelectedNodes,
  updateTempRecord,
  updateFlowPosition,
} = flowSlice.actions;

export const selectFlowData = (state) => state.flow.flowData;
export const selectDisplayNodes = (state) => state.flow.displaynodes;
export const selectSelectedNodes = (state) => state.flow.selectedNodes;
export const selectTempRecord = (state) => state.flow.tempRecord;
export const selectFlowPosition = (state) => state.flow.flowPosition;

export default flowSlice.reducer;
