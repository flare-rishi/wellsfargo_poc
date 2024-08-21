import React from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

const Difference = ({ oldCode, newCode }) => {
  const parsedOldCode = JSON.stringify(oldCode, null, 2); // stringify with indentation for better readability
  const parsedNewCode = JSON.stringify(newCode, null, 2);

  // console.log("parsedOldCode:", parsedOldCode);
  // console.log("parsedNewCode:", parsedNewCode);

  const variableStyle = {
    variables: {
      light: {
        diffViewerBackground: "#fff",
        diffViewerColor: "#212529",
        addedBackground: "#e6ffed",
        addedColor: "#24292e",
        removedBackground: "#ffeef0",
        removedColor: "#24292e",
        wordAddedBackground: "#acf2bd",
        wordRemovedBackground: "#fdb8c0",
        addedGutterBackground: "#cdffd8",
      },
    },
  };

  return (
    <ReactDiffViewer
      oldValue={parsedOldCode}
      newValue={parsedNewCode}
      splitView={true}
      expanded={false}
      disableWordDiff={false}
      styles={variableStyle}
      showDiffOnly={false}
      compareMethod={DiffMethod.WORDS}
    />
  );
};

export default Difference;
