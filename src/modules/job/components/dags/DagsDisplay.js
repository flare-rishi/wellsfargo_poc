import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CollapsibleRow from "./CollapsibleRow";
import ListView from "../../../dataDiscovery/components/common/listView/ListView";
import { checkObjectIsValid, replaceSpacesWithHyphens } from "../../../../utilities/utilities";
import { useSelector } from "react-redux";
import { selectDags } from "../../slices/jobSlice/jobSlice";
import "./dagsdisplay.css";
import { useLocation } from "react-router-dom";
const DagsDisplay = () => {
    const DagsDetails = useSelector(selectDags);
    const location = useLocation();

    console.log(" dagsDetails", DagsDetails);

    return (
        checkObjectIsValid(DagsDetails) && (
            <div className="dags-view div-background-border ">
                {Object.keys(DagsDetails)?.length > 0 && (
                    <ListView
                        listData={DagsDetails}
                        pathName={location.pathname}
                        replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                    />
                )}
            </div>
        )
    );
    // const columns = ["name", "owner", "description"];
    // const renderJobs = (jobs) => (
    //   <Table size="small" arial-label="jobs">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>Job_Id</TableCell>
    //         <TableCell>Name</TableCell>
    //         <TableCell>Status</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {jobs.map((job) => (
    //         <TableRow key={job.id}>
    //           <TableCell>{job.job_id}</TableCell>
    //           <TableCell>{job.name}</TableCell>
    //           <TableCell>{job.status}</TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // );
    // return (
    //   <TableContainer component={Paper}>
    //     <Table aria-label="collapsible table" borderAxis="bothBetween" size="sm">
    //       <TableHead>
    //         <TableRow>
    //           {columns.map((column, index) => (
    //             <TableCell key={index}>
    //               {column.replace("_", " ").toUpperCase()}
    //             </TableCell>
    //           ))}
    //           <TableCell>GRAPH</TableCell>
    //           <TableCell>JOBS</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {dags.map((dag) => (
    //           <CollapsibleRow
    //             key={dag.id}
    //             row={dag}
    //             columns={columns}
    //             collapseContent={{
    //               title: "Jobs",
    //               content: renderJobs(dag.jobs),
    //             }}
    //           />
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    //);
};
export default DagsDisplay;
