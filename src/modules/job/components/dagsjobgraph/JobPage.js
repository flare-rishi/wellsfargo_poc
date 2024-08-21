import React from "react";
import JobFlowController from "./JobFlowController";
import JobOverview from "../jobOverview/JobOverview";

const JobPage = () => {
    return (
        <div className="table-level-main-div">
            <div className="table-level-top-div  ">
                <JobFlowController />

                <div className="table-level-top-right-div div-background-border">
                    <JobOverview />
                </div>
            </div>
            <div className="table-level-bottom-div div-background-border"></div>
        </div>
    );
};

export default JobPage;
