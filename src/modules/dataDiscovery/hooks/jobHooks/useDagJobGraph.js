const useDagJobGraph = () => {
  function jobFlowGenerator(data) {
    const nodes = [];
    const edges = [];

    const nodeSpacingX = 200;
    const nodeSpacingY = 100;

    //let nodePositions = {};
    // data.jobs.forEach((job, index) => {
    //   const position = {
    //     x: (index + 1) * nodeSpacingX,
    //     y: index * nodeSpacingY,
    //   };
    //   nodePositions[job.id] = position;

    //   //create the job node
    //   nodes.push({
    //     id: job.job,
    //     type: "jobNode",
    //     data: { label: job.job, status: job.status, duration: job.duration },
    //     // position: { x: Math.random() * 500, y: Math.random() * 500 },

    //     // position: { x: nodeSpacingX, y: index * nodeSpacingY },
    //     position,
    //   });

    //   //create input nodes and edges
    //   job.inputs.forEach((input, index) => {
    //     const inputId = input;
    //     const position = { x: 0, y: (index + 1) * nodeSpacingY + 2 };
    //     nodePositions[input.id] = position;

    //     //create input node if it doesn't exist

    //     if (!nodes.find((node) => node.id === inputId)) {
    //       nodes.push({
    //         id: inputId,
    //         type: "tableNode",
    //         data: { label: input },
    //         //position: { x: Math.random() * 500, y: Math.random() * 500 },
    //         // position: { x: 0, y: index * nodeSpacingY },'
    //         position,
    //       });
    //     }

    //     //create edges from input to job
    //     edges.push({
    //       id: `${inputId}-${job.job}`,
    //       type: "customEdge",
    //       source: inputId,
    //       target: job.job,
    //     });
    //   });
    // });
    const inputPositions = {};

    // To avoid overlapping input nodes, we need to track the last used y position for inputs
    let inputNodeYPosition = 0;

    data.jobs.forEach((job, jobIndex) => {
      const jobId = job.jobid.toString();
      const jobPosition = {
        x: (jobIndex + 1) * nodeSpacingX,
        y: jobIndex * nodeSpacingY,
      };

      // Create job node
      nodes.push({
        id: jobId,
        type: "jobNode",
        data: {
          label: job.job,
          status: job.status,
          duration: job.duration,
          inputs: job.inputs,
          outputs: job.outputs,
        },
        position: jobPosition,
      });

      // Create input nodes and edges
      job.inputs.forEach((input) => {
        const inputJob = data.jobs.find((j) => j.job === input);

        if (inputJob) {
          //The input is a job , so connect it directly
          edges.push({
            id: `${inputJob.jobid}-${jobId}`,
            source: inputJob.jobid.toString(),
            target: jobId,
            type: "customEdge",
            //animated: true,
          });
        } else {
          //The input is not a job then create a table node
          if (!inputPositions[input]) {
            inputPositions[input] = {
              x: 0,
              y: inputNodeYPosition,
            };
            inputNodeYPosition += nodeSpacingY; //Increment y position for next input  node

            nodes.push({
              id: input,
              type: "tableNode",
              data: { label: input },
              position: inputPositions[input],
            });
          }

          //create edge from input to job
          edges.push({
            id: `${input}-${jobId}`,
            source: input,
            target: jobId,
            type: "customEdge",
          });
        }
      });
    });

    // const inputId = input;

    // // Check if input node already exists
    // if (!inputPositions[inputId]) {
    //   inputPositions[inputId] = {
    //     x: 0,
    //     y: inputNodeYPosition,
    //   };
    //   inputNodeYPosition += nodeSpacingY; // Increment y position for next input node

    //   nodes.push({
    //     id: inputId,
    //     type: "tableNode",
    //     data: { label: input },
    //     position: inputPositions[inputId],
    //   });
    // }

    // // Create edge from input to job
    // edges.push({
    //   id: `${inputId}-${jobId}`,
    //   source: inputId,
    //   target: jobId,
    //   type: "customEdge",
    // });

    console.log("nodes", nodes);

    return [nodes, edges];
  }
  return jobFlowGenerator;
};
export default useDagJobGraph;
