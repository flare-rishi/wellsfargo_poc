import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useDagJobGraph from "../../../dataDiscovery/hooks/jobHooks/useDagJobGraph";
import { checkObjectIsValid } from "../../../../utilities/utilities";
import { selectDagJobs } from "../../slices/jobSlice/jobSlice";
import { JobFlow } from "./JobFlow";
import { useParams } from "react-router-dom";
import useGetSearchParams from "../../../dataDiscovery/hooks/useLocationHooks/useGetSearchParams";
import { fetchDagsJobVerTableAsync } from "../../slices/jobSlice/jobThunk";
import { APIJOB } from "../../../../constants/constants";

const JobFlowController = () => {
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    const dispatch = useDispatch();
    const dagJobsDetails = useSelector(selectDagJobs);

    const jobFlowGenerator = useDagJobGraph();

    let { domainName, dataSetName, tableName } = useParams();
    let { versionId, forkId } = useGetSearchParams();
    useEffect(() => {
        dispatch(
            fetchDagsJobVerTableAsync({
                APIJOB,
                domainName,
                dataSetName,
                tableName,
                versionId,
                forkId,
            })
        );
    }, [versionId, forkId]);
    useEffect(() => {
        if (dagJobsDetails && Object.keys(dagJobsDetails).length > 0) {
            let [nodeData, edgeData] = jobFlowGenerator(dagJobsDetails);
            setNodes(nodeData);
            setEdges(edgeData);
        }
    }, [dagJobsDetails]);

    return (
        checkObjectIsValid(dagJobsDetails) && (
            <JobFlow
                nodes={nodes}
                edges={edges}
                // onEdgesChange={onEdgesChange}
                // onNodesChange={onNodesChange}
            />
        )
    );
};
export default JobFlowController;
