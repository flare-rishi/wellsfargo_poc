import "./tab.css";
import { GrAdd } from "react-icons/gr";
import TabController from "./TabControlller";
import { Tooltip } from "@mui/material";
function Tabs({
  towers,
  activeTab,
  createNewTab,
  handleTabClick,
  hover,

  // handleDoubleClick,
  setHover,
  handleDeleteTower,
  showToast,
  checkCondition,
  unSavableTabs,
}) {
  return (
    <>
      <div>
        <div className="div-tabs">
          {towers.map((tower, index) => {
            return (
              <TabController
                setHover={setHover}
                hover={hover}
                handleTabClick={handleTabClick}
                activeTab={activeTab}
                tower={tower}
                index={index}
                // handleDoubleClick={handleDoubleClick}
                handleDeleteTower={handleDeleteTower}
                unSavableTabs={unSavableTabs}
              ></TabController>
            );
          })}
          {checkCondition ? (
            <div className={`add-icon  `} onClick={createNewTab}>
              <GrAdd></GrAdd>
            </div>
          ) : (
            <div
              className={`add-icon add-icon-disabled`}
              onClick={() => showToast()}
            >
              <Tooltip placement="right" title="rename the changes">
                <GrAdd></GrAdd>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Tabs;
