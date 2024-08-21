import React from "react";
import SearchBox from "../searchbox/SearchBox";
import { BsTable } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { Button, Tooltip } from "@mui/material";

import "./VisualHead.css";
const VisualHead = ({
  selectedDataset,
  towers,
  handleFitView,
  saveToDisk,
  handleDoubleClickOnTable,
  options,
  handleSearch,
  resetHandleClick,
  isOpen,
  handleSplitView,
  isTextEditor,
  showSplitViewButton,
  hanldeTextEditorOpening,
  applyTextEditorData,
}) => {
  return (
    <div className={`visual-head-main ${isOpen && "compress-visual"}`}>
      <div className="info">
        <div className="dataset-info">
          <div
            className="visual-heading"
            onDoubleClick={() => handleDoubleClickOnTable()}
          >
            <div className="visual-icon table-icon">
              <BsTable></BsTable>
            </div>
            <h2>{selectedDataset}</h2>
          </div>
        </div>
        <div className="policysearchbox">
          <SearchBox options={options} handleSearch={handleSearch} />
        </div>
        {towers.length !== 0 && (
          <div className="buttons">
            <Button
              variant="outlined"
              sx={{ textTransform: "none", marginRight: "5px" }}
              onClick={() => {
                hanldeTextEditorOpening();
              }}
            >
              {isTextEditor ? "Go Back" : "Text Editor"}
            </Button>

            {isTextEditor == false && (
              <>
                {showSplitViewButton && (
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", marginRight: "5px" }}
                    onClick={() => {
                      handleSplitView();
                    }}
                  >
                    Split View
                  </Button>
                )}

                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", marginRight: "5px" }}
                  onClick={() => {
                    handleFitView();
                  }}
                >
                  fitview
                </Button>
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", marginRight: "5px" }}
                  onClick={() => resetHandleClick()}
                >
                  reset
                </Button>

                <Tooltip title="Save ACLs" placement="bottom">
                  <Button
                    variant="outlined"
                    onClick={saveToDisk}
                    // className="save-button"
                  >
                    <FaSave size="24px" />
                  </Button>
                </Tooltip>
              </>
            )}
            {isTextEditor && (
              <Tooltip title="Save ACLs" placement="bottom">
                <Button variant="outlined" onClick={applyTextEditorData}>
                  Apply
                </Button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualHead;
