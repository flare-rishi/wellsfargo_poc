import React from "react";

import { IoGridOutline } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";

import "./Filters.css";

const Filters = ({ activeViewType, handleActiveViewType }) => {
  return (
    <div className="filters-main-div">
      <div className="filter-date-div"></div>
      <div className="filters-right-div">
        <div className="toggle-icon-div">
          <div
            className={`icon-inner-div ${
              activeViewType === "list" && " tab-active"
            }`}
            onClick={() => handleActiveViewType("list")}
          >
            <FaListUl className="filter-icon" />
          </div>
          <div
            className={`icon-inner-div ${
              activeViewType === "grid" && "tab-active"
            }`}
            onClick={() => handleActiveViewType("grid")}
          >
            <IoGridOutline className="filter-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
