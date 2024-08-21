import React from "react";
import { useSelector } from "react-redux";

import { checkObjectIsValid } from "../../../../../utilities/utilities";

import { selectAllowCLick } from "../../../slices/tableLevelSlice/tableLevelSlice";

import "./LayoutTabs.css";

export default function LayoutTabs({ tabs, activeTab, handleOnChange }) {
  const allowClick = useSelector(selectAllowCLick);
  return (
    checkObjectIsValid(tabs) && (
      <div className={`tabs-main ${allowClick ? "wait" : "pointer"}`}>
        {tabs.map((tab, index) => (
          <p
            key={index}
            className={`tab-div ${activeTab === tab && "layout-tab-active"} `}
            onClick={() => handleOnChange(tab)}
          >
            {tab}
          </p>
        ))}
      </div>
    )
  );
}
