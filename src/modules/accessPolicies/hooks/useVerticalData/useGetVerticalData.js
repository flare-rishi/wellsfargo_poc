function useGetVerticalData() {
  function getVerticalData(verticalData) {
    let flowData = { nodes: [], edges: [] };

    const horizontalSpacing = 50;
    let internalHorizontalSPpacing = 200;
    const verticalSpacing = 100;
    let maxXPosition = 0;
    console.log("verticAL DCHFSIDUHVIADFGVI", verticalData);
    let layersArray = Object.keys(verticalData).sort();
    for (let i in layersArray) {
      console.log("i", i, layersArray[i]);
      for (let j in verticalData[layersArray[i]]) {
        // console.log("j", j, verticalData[layersArray[i]][j]);

        let node = {
          id: `${verticalData[layersArray[i]][j]["label"]}`,
          type: "node",
          position: { x: j * 200, y: i * 100 },
          data: {
            label: verticalData[layersArray[i]][j]["label"],
            layer: verticalData[layersArray[i]][j]["layer"],
          },
        };
        flowData.nodes.push(node);
      }
    }

    // Initialize vertical position

    // Create edges
    let count = 0;
    for (let layer in layersArray) {
      console.log(
        "verticaldata",
        layer,
        layersArray[layer],
        verticalData[layersArray[layer]]
      );

      for (let item in verticalData[layersArray[layer]]) {
        item = verticalData[layersArray[layer]][item];

        if (item.childs && Object.keys(item.childs).length > 0) {
          for (let childLayer in item.childs) {
            for (let childLabel of item.childs[childLayer]) {
              // let childNode = flowData.nodes.find(
              //   (node) =>
              //     node.data.label === childLabel &&
              //     node.id.includes(childLabel)
              // );

              // if (childNode) {
              let edge = {
                id: `${item.label}-${item.layer}-${childLabel}-${count}`,
                source: `${item.label}`,
                target: `${childLabel}`,
                type: "customedge",
                data: {
                  sourceLayer: item.layer,
                  targetLayer: childLayer,
                },
              };
              count++;
              flowData.edges.push(edge);
              // }
            }
          }
        }
      }
    }

    console.log(" flowData nodes", flowData.nodes);

    console.log("flowdata edges", flowData.edges);
    return flowData;
  }
  return getVerticalData;
}
export default useGetVerticalData;

// function selectedToLayer(selectedNodes) {
//   let layeredFormat = {};
//   let count = 1;
//   for (let i in selectedNodes) {
//     let LAYER = `layer${count}`;
//     layeredFormat[LAYER] = [];
//     let firstCount = 0;
//     for (let nodes in selectedNodes[i]) {
//       if (nodes === "parents") {
//         let parentLayers = Object.keys(selectedNodes[i]["parents"]).reverse();
//         for (let parentNodesLayer of parentLayers) {
//           for (let parentNodes in selectedNodes[i]["parents"][
//             parentNodesLayer
//           ]) {
//             console.log(
//               "paremntNodes",
//               selectedNodes[i]["parents"][parentNodesLayer][parentNodes]
//             );
//             let parentObj = {
//               label: selectedNodes[i]["parents"][parentNodesLayer][parentNodes],
//               layer: parentNodesLayer,
//             };
//             layeredFormat[LAYER].push(parentObj);
//           }
//         }
//       }
//       if (firstCount === 0) {
//         layeredFormat[LAYER].push({
//           label: i,
//           layer: selectedNodes[i]["policyLayer"],
//         });
//         firstCount++;
//       }

//       if (nodes === "childs") {
//         for (let childsLayers in selectedNodes[i]["childs"]) {
//           for (let childs in selectedNodes[i]["childs"][childsLayers]) {
//             console.log(
//               "selectedNodes[i][childs][childsLayers]",
//               selectedNodes[i]["childs"][childsLayers][childs]
//             );
//             let childObj = {
//               label: selectedNodes[i]["childs"][childsLayers][childs],
//               layer: childsLayers,
//             };
//             layeredFormat[LAYER].push(childObj);
//           }
//         }
//       }
//     }
//     count++;
//     console.log("COUNt");
//   }

//   console.log(layeredFormat);
// }
