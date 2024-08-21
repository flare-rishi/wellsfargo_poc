import React from "react";
import ListView from "../../common/listView/ListView";
import "./jobstatus.css";
const JobsData = {
  columns: ["status", "owner", "jobId"],
  data: [
    {
      status: "progress",
      owner: "lucky",
      jobId: "JI984",
    },
    {
      status: "stopped",
      owner: "kunal",
      jobId: "JI985",
    },
    {
      status: "completed",
      owner: "hrk",
      jobId: "JI986",
    },
    {
      status: "progress",
      owner: "kalki",
      jobId: "JI988",
    },
  ],
};

const JobStatus = () => {
  return (
    <div className="jobs-tile-box">
      <ListView listData={JobsData}></ListView>
    </div>
  );
};

export default JobStatus;
