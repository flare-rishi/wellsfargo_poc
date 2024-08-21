function useGetConnectionNodes() {
    function getConnectionNodes(nodename, layer, direction, displayNodes) {
        //parents or childs data for the policy

        var connectedPolicyData = towerDataJson[layer][nodename][direction];
        for (let connectionLayer in connectedPolicyData) {
            let connections = connectedPolicyData[connectionLayer];
            if (!displayNodes[connectionLayer]) {
                displayNodes[connectionLayer] = new Set();
            }

            //iterating through connected nodes(childs or parents)
            for (let j = 0; j < connections.length; j++) {
                //now adding those nodes data to the selected nodes json

                displayNodes[connectionLayer].add(connections[j]);

                //recursively calling the function to find all way deep connections
                getConnectionNodes(connections[j], connectionLayer, direction, displayNodes);
            }
        }
    }
    return getConnectionNodes;
}

export default useGetConnectionNodes;
