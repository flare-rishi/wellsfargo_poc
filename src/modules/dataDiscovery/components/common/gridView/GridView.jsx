import React, { useEffect, useState } from "react";

import GridCard from "./gridCard/GridCard";

import { DATA } from "../../../../../constants/constants";

import "./GridView.css";

const GridView = ({ listData, replaceSpacesWithHyphens, pathName }) => {
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    setGridData(listData[DATA]);
  }, [listData]);
  return (
    <div className="grid-box">
      {gridData.map((cardData, index) => {
        return (
          <GridCard
            cardData={cardData}
            replaceSpacesWithHyphens={replaceSpacesWithHyphens}
            pathName={pathName}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default GridView;
