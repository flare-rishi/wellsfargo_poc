import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDagsOfVerTableAsync } from "./jobThunk";
import { fetchDagsJobVerTableAsync } from "./jobThunk";

const initialState = {
  jobs: {},
  //data
  dagsData: {},
  jobsData: {},

  //loading
  dagsLoading: false,
  jobsLoading: false,
  //error
  dagsError: null,
  jobsError: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    updateJobs: (state, action) => {
      state.jobs = action.payload;
    },
    updateDags: (state) => {
      state.dagsData = {};
    },
    updateDagJobs: (state) => {
      state.jobsData = {};
    },
  },

  extraReducers: (builder) => {
    builder
      // fetching list of dags
      .addCase(fetchDagsOfVerTableAsync.pending, (state) => {
        state.dagsLoading = true;
        state.dagsError = null;
      })
      .addCase(fetchDagsOfVerTableAsync.fulfilled, (state, action) => {
        state.dagsLoading = false;
        state.dagsData = action.payload;
      })
      .addCase(fetchDagsOfVerTableAsync.rejected, (state, action) => {
        state.dagsLoading = false;
        state.dagsError = action.payload;
      })
      // fetching jobs of each Dag
      .addCase(fetchDagsJobVerTableAsync.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchDagsJobVerTableAsync.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobsData = action.payload;
      })
      .addCase(fetchDagsJobVerTableAsync.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload;
      });
  },
});

export const { updateJobs, updateDags } = jobSlice.actions;

export const selectJobs = (state) => state.job.jobs;
//Dags
export const selectDags = (state) => state.job.dagsData;
export const selectDagsLaoding = (state) => state.job.dagsLoading;
export const selectDagsError = (state) => state.job.dagsError;
//DagJobs
export const selectDagJobs = (state) => state.job.jobsData;
export const selectJobsLoading = (state) => state.job.jobsLoading;
export const selectJobsError = (state) => state.job.jobsError;

export default jobSlice.reducer;
