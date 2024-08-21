import { Tooltip } from "@mui/material";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import toast from "react-hot-toast";

function Tab({
  setHover,
  hover,
  handleTabClick,
  activeTab,
  tower,
  index,
  showMenu,
  handleAddUserGroup,
  showContextMenu,
  handleDeleteTower,

  // handleDoubleClick,
  handleMouseEnterMenu,
  handleMouseLeaveMenu,
  handleMouseLeaveDiv,
  handleMouseEnterDiv,

  handleCopyTower,
  unSavableTabs,
  editedTowers,
  editedNodes,
  // handleDoubleClick,
}) {
  const check =
    editedNodes.some(
      (node) => node.activeTowerName === Object.keys(tower)[0]
    ) || editedTowers.includes(Object.keys(tower)[0]);
  return (
    <div
      className={`div-tab  ${
        index === activeTab
          ? "active"
          : index === activeTab - 1
          ? "nearTab"
          : "inactive"
      }`}
      onMouseEnter={handleMouseEnterDiv}
      onMouseLeave={handleMouseLeaveDiv}
      // onDoubleClick={() => handleDoubleClick(index)}
      onClick={(e) => {
        e.preventDefault();
        handleTabClick(e, index, tower);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        showContextMenu(e, index);
      }}
    >
      <div
        style={{ display: "flex" }}
        onMouseEnter={() => {
          setHover(index);
        }}
        onMouseLeave={() => {
          setHover(-1);
        }}
      >
        <span
          className={`tab ${
            index === activeTab ? "active-tab" : "inactive-tab"
          }`}
          style={{ zIndex: -1 }}
        >
          {Object.keys(tower)[0]}
        </span>

        <p className="indication"> {tower[Object.keys(tower)[0]]}</p>

        <span
          className={`${
            index !== activeTab &&
            index !== activeTab - 1 &&
            hover !== index &&
            hover - 1 !== index
              ? "show-vertical"
              : "hide-vertical"
          } vertical `}
        >
          |
        </span>
        {check && <GoDotFill className="edited-node" />}
      </div>
      {index === activeTab && showMenu && (
        <div
          className={`tab-modal ${showMenu ? "" : "tab-hidden"}`}
          // style={{
          //   position: "absolute",
          //   top: menuPosition.y,
          //   left: menuPosition.x,
          // }}
          onMouseEnter={handleMouseEnterMenu}
          onMouseLeave={handleMouseLeaveMenu}
        >
          <Tooltip title="Add User Group">
            <div
              className="tab-inner-div"
              onClick={(e) => {
                e.stopPropagation();
                handleAddUserGroup();
              }}
            >
              <AiOutlineUsergroupAdd className="tab-inner-div-icons" />
            </div>
          </Tooltip>

          {unSavableTabs === 0 ? (
            <Tooltip title="copy Tower">
              <div
                className="tab-inner-div"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyTower(Object.keys(tower)[0]);
                }}
              >
                <FaRegCopy className="tab-inner-div-icons" />
              </div>
            </Tooltip>
          ) : (
            <Tooltip title="copy Tower ">
              <div
                className="tab-inner-div disable"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.error("rename the tab");
                }}
              >
                <FaRegCopy className="tab-inner-div-icons" />
              </div>
            </Tooltip>
          )}

          <Tooltip title="Delete Tower">
            <div
              className="tab-inner-div"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTower(Object.keys(tower)[0]);
              }}
            >
              <MdDeleteOutline className="tab-inner-div-icons" />
            </div>
          </Tooltip>
        </div>
      )}{" "}
    </div>
  );
}

export default Tab;
