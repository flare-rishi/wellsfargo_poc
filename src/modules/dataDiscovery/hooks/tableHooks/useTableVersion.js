import { GENERATIONS } from "../../../../constants/constants";

function useTableVersion() {
    function flowGenerator(tableVersions) {
        let nodes = [];
        let edges = [];

        let x = 0,
            y = 0;

        let forkGap = 30;
        let dateGap = 150;
        let forkGapY = 30;
        let previousDateNode = null;

        let count = 0;
        let direction = 0;

        Object.keys(tableVersions)?.map((version, index) => {
            if (count % 2 === 0) {
                y = -10;
                direction = 0;
            } else {
                y = -10;
                direction = 0;
            }

            const id = `${version}`;
            nodes.push({
                id: id,
                type: "circular2",
                position: { x: x, y: 0 },
                data: {
                    label: id,
                    date: tableVersions[version].Updated,
                    color: "#D2FF98",
                    direction: direction,
                    borderColor: "#6FBA0F",
                },
            });

            if (previousDateNode) {
                edges.push({
                    id: `${previousDateNode}-${id}`,
                    source: previousDateNode,
                    target: id,
                    style: {
                        strokeWidth: 1,
                        // stroke: "#6FBA0F",
                    },
                });
            }
            if (tableVersions[version]["forks"]) {
                for (let i in tableVersions[version]["forks"]) {
                    recursivefunc(tableVersions[version]["forks"][i], x, id, direction, 0);
                }
            }
            previousDateNode = id;
            x += dateGap;
            count++;
        });

        function recursivefunc(data, x, source, direction, biasGap) {
            let sourceHandle = null;

            if (direction == 0) {
                sourceHandle = "top-source-handle";
            } else {
                sourceHandle = "bottom-source-handle";
            }

            for (let key in data) {
                let color = "rgb(251,251,251)";
                let highlightedColor = "rgba(111, 186, 15, 0.8)";

                if (direction == 0) {
                    y = y - forkGapY;
                } else {
                    y = y + forkGapY;
                }

                let newx = x + forkGap + biasGap;

                let id = `${source}-${key}`;
                let node = {
                    id: id,
                    type: "rectangular2",
                    data: {
                        branch: key,
                        label: key,
                        color,
                        highlightedColor,
                        [GENERATIONS]: data[key][GENERATIONS],
                    },
                    position: { x: newx, y: y },
                };
                nodes.push(node);

                let edge = {
                    id: `${id}-edge`,
                    type: "customStepEdge",
                    source: source,
                    target: id,
                    sourceHandle: sourceHandle,
                    style: {
                        strokeWidth: 0.5,
                    },
                };

                edges.push(edge);
            }
        }

        return [nodes, edges];
    }

    return flowGenerator;
}

export default useTableVersion;
