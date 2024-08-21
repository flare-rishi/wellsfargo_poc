import React from "react";
import ChipComponent from "../../common/chipComponent/ChipComponent";

const tags = [
  "cleaned",
  "raw",
  "aggregated",
  "transformed",
  "anonymized",
  "normalized",
];

const Tags = ({ text }) => {
  return (
    <div className="Tags-tiles">
      <ChipComponent chipData={text ? text : tags}></ChipComponent>
    </div>
  );
};

export default Tags;
