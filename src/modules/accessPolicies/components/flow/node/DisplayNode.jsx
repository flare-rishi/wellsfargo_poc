import React from "react";
import { Handle } from "reactflow";
import { Tooltip } from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { GoPersonAdd } from "react-icons/go";
import { GoDotFill } from "react-icons/go";

const DisplayNode = ({
  handleMenu,
  data,
  hide,
  highlight,
  showMenu,
  Position,
  handleDeleteNodes,
  handleAddNodeNextLayer,
  handleCopyNode,
  handleSingleClickOnNode,
  handleDoubleOnNode,
  towerId,
  handleMouseEnterMenu,
  handleMouseLeaveMenu,
  handleMouseLeaveDiv,
  handleMouseEnterDiv,
  interHighlight,
  editedNodes,
  unLayered,
  searchedPolicy,
  isSplitViewOpen,
}) => {
  // console.log("the inter highlight data received = ", interHighlight);
  var disable = data.label.includes("--EDIT-ME--");

  const highLight =
    disable || editedNodes.some((node) => node.name === data.label);

  const handleContextMenu = (event) => {
    if (!hide) {
      event.preventDefault();
      handleMenu();
    }
  };

  return (
    <>
      <div
        className={`${hide ? "transparent" : ""} scaling-div transition-div`}
        onDoubleClick={(e) => {
          e.preventDefault();
          handleDoubleOnNode(e, data);
        }}
        onClick={(e) => {
          e.preventDefault();
          handleSingleClickOnNode(e, data);
        }}
        onContextMenu={handleContextMenu}
      >
        <Handle
          type="target"
          position={isSplitViewOpen ? Position.Top : Position.Left}
        />

        <div
          className={`node-outer tooltip ${hide ? "" : "show"} ${
            highlight ? "highlight" : ""
          }
          
           ${searchedPolicy == data.label ? "show-searched" : ""} ${
            data?.highlightNode && "highlight"
          }`}
          onMouseEnter={handleMouseEnterDiv}
          onMouseLeave={handleMouseLeaveDiv}
        >
          <div className="node-main">
            <p className="node-content">{data.label}</p>

            <div className="rows">
              {towerId && <p className="row"> {towerId} </p>}
              {interHighlight.length > 0 &&
                interHighlight.map((interData) => {
                  return <p className="row"> {interData} </p>;
                })}
            </div>
            <div className="rows top-right">
              {unLayered.length > 0 &&
                unLayered.map((interData) => {
                  return <p className="row"> {interData} </p>;
                })}
            </div>

            {highLight && <GoDotFill className="edited-node" />}
          </div>
          {showMenu && (
            <div
              className={`modal ${showMenu ? "" : "hidden"}`}
              onMouseEnter={handleMouseEnterMenu}
              onMouseLeave={handleMouseLeaveMenu}
            >
              <Tooltip title="Add Child Policy">
                <div
                  className={`inner-div ${disable && "disable"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (disable)
                      toast(
                        <div className="info-toast">
                          <MdEdit className="inner-div-icons" />
                          Rename The Policy
                        </div>,
                        {
                          duration: 5000,
                        }
                      );
                    else handleAddNodeNextLayer(data);
                  }}
                >
                  <GoPersonAdd className="inner-div-icons" />
                </div>
              </Tooltip>
              <Tooltip title="Copy Policy">
                <div
                  className={`inner-div ${disable && "disable"}`}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (disable)
                      toast(
                        <div className="info-toast">
                          <MdEdit className="inner-div-icons" />
                          Rename The Policy
                        </div>,
                        {
                          duration: 3000,
                        }
                      );
                    else handleCopyNode(data);
                  }}
                >
                  <FaRegCopy className="inner-div-icons" />
                </div>
              </Tooltip>
              <Tooltip title="Delete Policy">
                <div
                  className="inner-div"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNodes(data);
                  }}
                >
                  <MdDeleteOutline className="inner-div-icons" />
                </div>
              </Tooltip>
            </div>
          )}
        </div>

        <Handle
          type="source"
          position={isSplitViewOpen ? Position.Bottom : Position.Right}
        />
      </div>
    </>
  );
};

export default DisplayNode;
