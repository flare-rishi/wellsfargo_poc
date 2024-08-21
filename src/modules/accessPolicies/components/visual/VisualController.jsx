import { useEffect, useState } from "react";

import Visual from "./Visual";

import {
  handleOpenEditModal,
  selectEditModalData,
  selectTableModalData,
  updateActiveTab,
  updateEditModalData,
} from "../../slices/crud/crudSlice";
import useGetTowerNames from "../../hooks/useGetTowerNames";
import useAddNewTab from "../../hooks/useAddNewTab";
import { useDispatch, useSelector } from "react-redux";

import {
  selectUnSavableNodes,
  selectUnSavableTabs,
} from "../../slices/save/saveSlice";
import useDeleteTower from "../../hooks/useDeleteTower/useDeleteTower";
import toast from "react-hot-toast";
import useGetTowerData from "../../hooks/useGetTowerData/useGetTowerData";

import {
  selectIsSplitViewOpen,
  selectSplitViewData,
  updateTowers,
} from "../../slices/dataSlice/dataSlice";

function VisualController({ isOpen, selectedDataset, towers }) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(-1);
  const [hover, setHover] = useState(-1);

  const unSavableNodes = useSelector(selectUnSavableNodes);
  const unSavableTabs = useSelector(selectUnSavableTabs);
  const openEdit = useSelector(selectEditModalData);
  // const towers = useSelector(selectTowers);
  const tableModalData = useSelector(selectTableModalData);
  const isSplitViewOpen = useSelector(selectIsSplitViewOpen);
  const splitViewData = useSelector(selectSplitViewData);

  const addNewTab = useAddNewTab();
  const getTowerNames = useGetTowerNames();
  const deleteTower = useDeleteTower();
  const getTowerData = useGetTowerData();
  // const convertBack = useConvertToOriginalJson();

  useEffect(() => {
    const initialTowers = getTowerNames();

    dispatch(updateTowers(initialTowers));
    if (initialTowers.length > 0) {
      setActiveTab(0);
      dispatch(updateActiveTab(Object.keys(initialTowers[0])[0]));
    }
  }, [selectedDataset]);

  useEffect(() => {
    dispatch(updateTowers(getTowerNames()));
  }, [openEdit]);

  function createNewTab() {
    //pass new tower name and details as parameter to be implemented
    addNewTab();
    var tabLength = towers.length;
    dispatch(updateTowers([...towers, { "--EDIT-ME--": tabLength + 1 }]));
    dispatch(updateActiveTab("--EDIT-ME--"));
    setActiveTab(tabLength);
  }

  function handleTabClick(event, index, tab) {
    if (unSavableNodes === 0) {
      if (event.detail === 1) {
        setActiveTab(index);
        dispatch(updateActiveTab(Object.keys(towers[index])[0]));
      } else if (event.detail === 2) {
        handleTowerEdit(tab);
      }
    } else toast.error("please rename the nodeName");
  }

  const isNewTabPresent = towers.some((obj) =>
    Object.keys(obj).includes("--EDIT-ME--")
  );

  function handleDeleteTower(towerName) {
    var msg = deleteTower(towerName);
    if (msg === 1) {
      var arr = [...towers];
      arr.splice(activeTab, 1);
      if (activeTab !== 0) {
        setActiveTab(activeTab - 1);
        dispatch(updateActiveTab(Object.keys(towers[activeTab - 1])[0]));
      } else {
        setActiveTab(0);
      }

      toast.success("Tower deleted");
    } else {
      toast.error("selected Tower contains Access-policies");
    }
  }

  const checkCondition =
    !isNewTabPresent && unSavableTabs === 0 && unSavableNodes === 0;

  const showToast = () => {
    if (unSavableNodes !== 0) {
      toast.error("rename the node name ");
    }
    if (unSavableTabs !== 0) {
      toast.error("rename the tab name");
    }
  };

  const handleTowerEdit = (value) => {
    let towerName = Object.keys(value)[0];
    let towerDetails = getTowerData(towerName);
    towerDetails["type"] = "tower";
    dispatch(updateEditModalData(towerDetails));
    dispatch(handleOpenEditModal());
  };

  return (
    <>
      <Visual
        selectedDataset={selectedDataset}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        towers={towers}
        createNewTab={createNewTab}
        hover={hover}
        setHover={setHover}
        teamCount={towers.length}
        policyCount={30}
        handleDeleteTower={handleDeleteTower}
        isOpen={isOpen}
        className="visual"
        checkCondition={checkCondition}
        unSavableTabs={unSavableTabs}
        showToast={showToast}
        tableModalData={tableModalData}
        isSplitViewOpen={isSplitViewOpen}
        splitViewData={splitViewData}
      ></Visual>
    </>
  );
}

export default VisualController;
