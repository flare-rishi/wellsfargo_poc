import React from "react";

import "./TableJobs.css";
import { RenderGraph } from "../../../dataDiscovery/components/layout/tablesAndJobsLayout/TableAndJobsLayout";
import DagsController from "../dags/DagsController";

const TableJobs = ({ type }) => {
    return (
        <div className="job-level-main-div ">
            <div className="div-background-border  job-graph-div">
                <RenderGraph type={type} />
            </div>
            <div className="job-bottom-div">
                <DagsController />
            </div>
        </div>
    );
};

export default TableJobs;
