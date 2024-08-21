import FlowController from "../flow/FlowController";
import Tabs from "../tabs/Tabs";
import "./visual.css";

import { Button } from "@mui/material";
import TableModalController from "../tableModal/TableModalController";
import SplitView from "../splitView/SplitView";
import SplitViewController from "../splitView/SplitViewController";
function Visual({
  isOpen,
  activeTab,
  towers,
  handleTabClick,
  createNewTab,
  hover,
  setHover,
  handleDeleteTower,
  showToast,
  checkCondition,
  unSavableTabs,
  tableModalData,
  isSplitViewOpen,
  splitViewData,
}) {
  const showTowers = !isSplitViewOpen && towers.length !== 0;
  return (
    <>
      <div className={`visual ${isOpen && "compress-react-flow-visual"}`}>
        {showTowers && (
          <Tabs
            towers={towers}
            activeTab={activeTab}
            handleTabClick={handleTabClick}
            createNewTab={createNewTab}
            hover={hover}
            setHover={setHover}
            handleDeleteTower={handleDeleteTower}
            checkCondition={checkCondition}
            showToast={showToast}
            unSavableTabs={unSavableTabs}
          ></Tabs>
        )}

        <div className="flow-controller-div">
          {towers.length !== 0 ? (
            <>
              {" "}
              <FlowController />
              {isSplitViewOpen && (
                <SplitViewController splitViewData={splitViewData} />
              )}
            </>
          ) : (
            <div className="empty-tower">
              <p>To create new Tower Click upon the button below</p>

              <div className="newTower-button-box">
                <Button variant="outlined" onClick={createNewTab}>
                  <b>create-new-tower</b>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {Object.entries(tableModalData).length > 0 && <TableModalController />}
    </>
  );
}

export default Visual;
