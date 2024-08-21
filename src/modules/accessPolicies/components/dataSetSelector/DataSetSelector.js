import React, { useEffect, useRef, useState } from "react";
import "./DataSetSelector.css";

import { FaDatabase } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { TextField } from "@mui/material";

import toast from "react-hot-toast";

const DataSetSelector = ({
  isOpen,
  toggleDataSetSelector,
  handleDataSetSelector,
  highlightDataSet,
  dataSetNames,
  setSelected,
  check,
}) => {
  const sidebarRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        highlightDataSet &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleDataSetSelector();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleDataSetSelector]);
  return (
    <div className="DataSetSelector-main">
      <div
        className="dataSourceIcon"
        onClick={() => {
          check
            ? toast.error("please save the changes")
            : toggleDataSetSelector();
        }}
      >
        <FaDatabase
          style={{
            height: "25px",
            width: "25px",
            color: "orange",
            marginTop: "5px",
          }}
        />
      </div>
      <div className={`slide-in ${isOpen ? "show" : ""}`} ref={sidebarRef}>
        <div className="DataSetSelector-heading-con">
          <h4 className="sidebar-heading">Data Sources</h4>
          <RxCross2
            onClick={() => toggleDataSetSelector()}
            style={{
              color: "orange",
              height: "25px",
              width: "25px",
              cursor: "pointer",
              right: "15px",
              position: "absolute",
            }}
          />
        </div>

        <div className="searchbox">
          <TextField
            fullWidth
            size="small"
            placeholder="search..."
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
          />
        </div>

        <div className="policies-main">
          {dataSetNames
            .filter(({ tableName }) =>
              tableName.toLowerCase().includes(searchQuery)
            )
            .map((text, index) => (
              <div
                className="policies-inner"
                key={index}
                onClick={() => {
                  setSelected(false);
                  handleDataSetSelector(text);
                }}
                style={{
                  backgroundColor:
                    highlightDataSet &&
                    highlightDataSet === text &&
                    "rgb(255, 233, 212)",
                  cursor: "pointer",
                }}
              >
                <p
                  className="policies-p"
                  style={{
                    color:
                      highlightDataSet &&
                      highlightDataSet === text &&
                      "rgb(231, 112, 0)",
                  }}
                >
                  {text.tableName}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DataSetSelector;
