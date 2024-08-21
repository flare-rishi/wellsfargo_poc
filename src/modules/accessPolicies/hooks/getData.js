import { useDispatch } from "react-redux";
import { updateSplitViewData, updateUniquesNodeNames } from "../slices/dataSlice/dataSlice";
import {
    CHILDS,
    FILTER,
    INTERPARENTS,
    INTERTOWER,
    MASKS,
    PIIVISIBILITY,
    PREEDIT,
    TOWERID,
    UNLAYEREDCHILDS,
} from "../../../constants/constants";

//this function converts and gives us the required data from layerWise json

// update this functionality for  both vertical and horizontal  towers
// step 1 :- update the parameters  which accepts the vertical or horizontal
// step 2:- modify the code like the source and target with as per the parameters and x and y positions
function useGetData() {
    const dispatch = useDispatch();

    function getData(dataJson) {
        //
        dispatch(updateSplitViewData({}));
        //

        let flowData = { nodes: [], edges: [] };
        var layers = [];

        for (let layer in dataJson) {
            if (layer !== PREEDIT && layer !== PIIVISIBILITY && layer != MASKS && layer != FILTER) {
                layers.push(layer);
            }
        }
        let uniqueNames = [];
        // console.log("layers in reactflow json  = ", layers);
        for (let i = 0; i < layers.length; i++) {
            var nodes = Object.keys(dataJson[layers[i]]);
            for (let j = 0; j < nodes.length; j++) {
                //Nodes code

                uniqueNames.push(nodes[j]);
                var data = {};
                data = { label: nodes[j], layer: layers[i] };
                if (dataJson[layers[i]][nodes[j]][TOWERID]) {
                    data[TOWERID] = dataJson[layers[i]][nodes[j]][TOWERID];
                }
                if (dataJson[layers[i]][nodes[j]][INTERPARENTS]) {
                    data[INTERPARENTS] = dataJson[layers[i]][nodes[j]][INTERPARENTS];
                }
                if (dataJson[layers[i]][nodes[j]][UNLAYEREDCHILDS]) {
                    data[UNLAYEREDCHILDS] = dataJson[layers[i]][nodes[j]][UNLAYEREDCHILDS];
                }

                var node = {
                    id: nodes[j],
                    type: "node",
                    position: { x: i * 350, y: j * 100 },
                    data: data,
                };
                flowData.nodes.push(node);

                //edges code
                var childLayers = Object.keys(dataJson[layers[i]][nodes[j]][CHILDS]);
                for (let k = 0; k < childLayers.length; k++) {
                    var childs = dataJson[layers[i]][nodes[j]][CHILDS][childLayers[k]];
                    for (let l = 0; l < childs.length; l++) {
                        var edge = {
                            id: `${nodes[j]}-${childs[l]}`,
                            source: nodes[j],
                            target: childs[l],
                            type: "customedge",
                            data: { sourceLayer: layers[i], targetLayer: childLayers[k] },
                        };

                        flowData.edges.push(edge);
                    }
                }
            }
        }

        dispatch(updateUniquesNodeNames(uniqueNames.sort()));

        return flowData;
    }
    return getData;
}

export default useGetData;
