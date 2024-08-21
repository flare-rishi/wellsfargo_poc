import { useRef, useState } from "react";
import Tab from "./Tab";
import { useEffect } from "react";

import useCreateUserGroup from "../../hooks/useCreateUserGroup/useCreateUserGroup";

import useCopyTower from "../../hooks/useCopyTower/useCopyTower";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  selectEditedNodes,
  selectEditedTowers,
} from "../../slices/save/saveSlice";

function TabController({
  setHover,
  hover,
  handleTabClick,
  activeTab,
  tower,
  index,
  unSavableTabs,

  handleDeleteTower,
}) {
  const menuTimeoutRef = useRef(null);
  // const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  const editedTowers = useSelector(selectEditedTowers);
  const editedNodes = useSelector(selectEditedNodes);

  const copyTower = useCopyTower();
  const createUserGroup = useCreateUserGroup();

  function showContextMenu(e, index) {
    e.preventDefault(); // Prevent default context menu
    // const rect = e.target.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;
    // setMenuPosition({ x, y });
    setShowMenu(true);
  }

  const handleCopyTower = (towerName) => {
    if (unSavableTabs === 0) copyTower(towerName);
    else toast.error("rename the tab");
  };

  function handleAddUserGroup() {
    createUserGroup();
  }

  function hideMenuWithDelay() {
    menuTimeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 2000);
  }

  function handleMouseEnterMenu() {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
  }

  function handleMouseLeaveMenu() {
    hideMenuWithDelay();
  }

  function handleMouseLeaveDiv() {
    hideMenuWithDelay();
  }

  function handleMouseEnterDiv() {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
  }

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Tab
      showMenu={showMenu}
      showContextMenu={showContextMenu}
      setHover={setHover}
      hover={hover}
      handleTabClick={handleTabClick}
      activeTab={activeTab}
      tower={tower}
      index={index}
      handleAddUserGroup={handleAddUserGroup}
      // menuPosition={menuPosition}
      handleDeleteTower={handleDeleteTower}
      hideMenuWithDelay={hideMenuWithDelay}
      handleMouseEnterMenu={handleMouseEnterMenu}
      handleMouseLeaveMenu={handleMouseLeaveMenu}
      handleMouseLeaveDiv={handleMouseLeaveDiv}
      handleMouseEnterDiv={handleMouseEnterDiv}
      handleCopyTower={handleCopyTower}
      unSavableTabs={unSavableTabs}
      editedTowers={editedTowers}
      editedNodes={editedNodes}
    />
  );
}

export default TabController;
