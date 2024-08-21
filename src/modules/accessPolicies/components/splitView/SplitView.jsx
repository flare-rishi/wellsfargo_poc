import React, { useEffect } from "react";
import "./SplitView.css";
import EditModal from "../editModal/EditModal";
import EditModalController from "../editModal/EditModalController";
const SplitView = ({ selectedNodes }) => {
  return (
    <div className="split-view-main">
      {Object.keys(selectedNodes).length > 0 &&
        Object.keys(selectedNodes).map((selectedNode) => (
          <EditModalController
            selectedNodes={selectedNodes}
            obj={selectedNodes[selectedNode]}
            split
            key={selectedNode}
          />
        ))}
    </div>
  );
};

export default SplitView;
