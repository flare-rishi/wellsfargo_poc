import { CHILDS, PARENTS } from "../../../../constants/constants";

function useConvertToVerticalData() {
    function convertSelectedToLayer(selectedNodes, dataJson) {
        let allLayers = {};

        for (let i in selectedNodes) {
            for (let j in selectedNodes[i]) {
                if (j === "parentsNodes" || j === "childsNodes") {
                    for (let k in selectedNodes[i][j]) {
                        for (let l in selectedNodes[i][j][k]) {
                            if (!allLayers[k]) {
                                allLayers[k] = new Set();
                            }
                            for (let m in selectedNodes[i][j][k]) {
                                allLayers[k] = allLayers[k].add(selectedNodes[i][j][k][m]);
                            }
                        }
                    }
                }

                if (j === "policyLayer") {
                    if (allLayers[selectedNodes[i][j]]) {
                        allLayers[selectedNodes[i][j]] = allLayers[selectedNodes[i][j]].add(
                            selectedNodes[i]["policyName"]
                        );
                    } else {
                        allLayers[selectedNodes[i][j]] = new Set();
                        allLayers[selectedNodes[i][j]].add(selectedNodes[i]["policyName"]);
                    }
                }
            }
        }

        for (let layer in allLayers) {
            allLayers[layer] = Array.from(allLayers[layer]);

            console.log("allLayers", allLayers);
            for (let i in allLayers[layer]) {
                console.log("dataJson[layer][allLayers[layer][i]][", dataJson[layer][allLayers[layer][i]]);

                allLayers[layer].splice(i, 1, {
                    label: allLayers[layer][i],
                    layer,
                    childs: dataJson[layer][allLayers[layer][i]][CHILDS],
                    parents: dataJson[layer][allLayers[layer][i]][PARENTS],
                });
            }
        }

        return allLayers;
    }
    return convertSelectedToLayer;
}
export default useConvertToVerticalData;

// function convertSelectedToLayer(selectedNodes, dataJson) {
//   console.log("datajson", dataJson);
//   let layeredFormat = {};
//   let count = 1;
//   for (let i in selectedNodes) {
//     let LAYER = `layer${count}`;
//     layeredFormat[LAYER] = [];
//     let firstCount = 0;
//     for (let nodes in selectedNodes[i]) {
//       if (nodes === "parentsNodes") {
//         let parentLayers = Object.keys(
//           selectedNodes[i]["parentsNodes"]
//         ).sort();
//         console.log("parentLayers", parentLayers);
//         for (let parentNodesLayer of parentLayers) {
//           for (let parentNodes in selectedNodes[i]["parentsNodes"][
//             parentNodesLayer
//           ]) {
//             let parentObj = {
//               label:
//                 selectedNodes[i]["parentsNodes"][parentNodesLayer][
//                   parentNodes
//                 ],
//               layer: parentNodesLayer,
//               parents:
//                 dataJson[parentNodesLayer][
//                   selectedNodes[i]["parentsNodes"][parentNodesLayer][
//                     parentNodes
//                   ]
//                 ]["parents"],
//               childs:
//                 dataJson[parentNodesLayer][
//                   selectedNodes[i]["parentsNodes"][parentNodesLayer][
//                     parentNodes
//                   ]
//                 ]["childs"],
//             };

//             layeredFormat[LAYER].push(parentObj);
//           }
//         }
//       }
//       if (firstCount === 0) {
//         layeredFormat[LAYER].push({
//           label: i,
//           layer: selectedNodes[i]["policyLayer"],
//           parents: dataJson[selectedNodes[i]["policyLayer"]][i]["parents"],
//           childs: dataJson[selectedNodes[i]["policyLayer"]][i]["childs"],
//           highlightNode: true,
//         });
//         firstCount++;
//       }

//       if (nodes === "childsNodes") {
//         for (let childsLayers in selectedNodes[i]["childsNodes"]) {
//           for (let childs in selectedNodes[i]["childsNodes"][childsLayers]) {
//             let childObj = {
//               label: selectedNodes[i]["childsNodes"][childsLayers][childs],
//               layer: childsLayers,
//               parents:
//                 dataJson[childsLayers][
//                   selectedNodes[i]["childsNodes"][childsLayers][childs]
//                 ]["parents"],
//               childs:
//                 dataJson[childsLayers][
//                   selectedNodes[i]["childsNodes"][childsLayers][childs]
//                 ]["childs"],
//             };
//             layeredFormat[LAYER].push(childObj);
//           }
//         }
//       }
//     }
//     count++;
//   }

//   console.log("layeredFormat", layeredFormat);
//   return layeredFormat;
// }
