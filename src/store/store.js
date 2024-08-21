import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import flowSliceReducer from "../modules/accessPolicies/slices/flowSlice/flowSlice";
import saveSlice from "../modules/accessPolicies/slices/save/saveSlice";
import dataReducer from "../modules/accessPolicies/slices/dataSlice/dataSlice";
import crudReducer from "../modules/accessPolicies/slices/crud/crudSlice";
import wareHouseReducer from "../modules/dataDiscovery/slices/wareHouseSlice/wareHouseSlice";
import domainReducer from "../modules/dataDiscovery/slices/domainSlice/domainSlice";
import dataSetReducer from "../modules/dataDiscovery/slices/dataSetsSlice/dataSetsSlice";
import tableLevelReducer from "../modules/dataDiscovery/slices/tableLevelSlice/tableLevelSlice";
import jobReducer from "../modules/job/slices/jobSlice/jobSlice";
import tabReducer from "../slice/tabs/tabSlice";
import userReducer from "../slice/userSlices/userSlice";
import cacheMiddleware from "../axiosConfig/cacheMiddleware";

const store = configureStore({
  reducer: {
    save: saveSlice,
    data: dataReducer,
    flow: flowSliceReducer,
    crud: crudReducer,
    wareHouse: wareHouseReducer,
    domain: domainReducer,
    dataSet: dataSetReducer,
    table: tableLevelReducer,
    job: jobReducer,
    tab: tabReducer,
    user: userReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(cacheMiddleware),
});

export default store;
