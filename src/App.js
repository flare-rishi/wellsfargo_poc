import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./modules/home/Home";
import AccessPolicies from "./modules/accessPolicies/components/access-policies/AccessPolicies";
import ProtectedRoutes from "./modules/auth/components/protectedRoutes/ProtectedRoutes";
import Layout from "./modules/dataDiscovery/components/layout/Layout";
import WareHouseController from "./modules/dataDiscovery/components/wareHouse/WareHouseController";
import DomainsController from "./modules/dataDiscovery/components/domainsAndDataSets/domains/DomainsController";
import DataSetsController from "./modules/dataDiscovery/components/domainsAndDataSets/datasets/DataSetsContoller";
import TableLevelController from "./modules/dataDiscovery/components/TableLevelView/TableLevelController";

import { DAG, DATASETNAME, DOMAINNAME, TABLENAME, URL, WAREHOUSE } from "./constants/constants";
import AccessPoliciesPage from "./modules/dataDiscovery/components/accessPoliciesPage/AccessPoliciesPage";
import TableJobController from "./modules/job/components/tableJobs/TableJobController";
import { JobFlow } from "./modules/job/components/dagsjobgraph/JobFlow";
import JobFlowController from "./modules/job/components/dagsjobgraph/JobFlowController";
import JobPage from "./modules/job/components/dagsjobgraph/JobPage";

function App() {
    if (!localStorage.getItem("url")) localStorage.setItem("url", URL);

    return (
        <Routes>
            <Route element={<ProtectedRoutes />}>
                <Route exact path="/" element={<Home />} />
                <Route path="/access-policies" element={<AccessPolicies />} />
                <Route path="/data" element={<Layout />}>
                    <Route index element={<WareHouseController />} />
                    <Route path={`/data/:${WAREHOUSE}/:${DOMAINNAME}`} element={<DomainsController />} />{" "}
                    <Route
                        path={`/data/:${WAREHOUSE}/:${DOMAINNAME}/:${DATASETNAME}`}
                        element={<DataSetsController />}
                    />
                    <Route
                        path={`/data/:${WAREHOUSE}/:${DOMAINNAME}/:${DATASETNAME}/:${TABLENAME}`}
                        element={<TableLevelController />}
                    />
                </Route>
                <Route path="/jobs" element={<Layout />}>
                    <Route
                        path={`/jobs/:${WAREHOUSE}/:${DOMAINNAME}/:${DATASETNAME}/:${TABLENAME}`}
                        element={<TableJobController />}
                    />
                    <Route
                        path={`/jobs/:${WAREHOUSE}/:${DOMAINNAME}/:${DATASETNAME}/:${TABLENAME}/:${DAG}`}
                        element={<JobPage />}
                    />
                </Route>
                <Route path="/access" element={<Layout />}>
                    <Route
                        path={`/access/:${WAREHOUSE}/:${DOMAINNAME}/:${DATASETNAME}/:${TABLENAME}`}
                        element={<AccessPoliciesPage />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
