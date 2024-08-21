import useAddNewTab from "../useAddNewTab";
import useGetTowerData from "../useGetTowerData/useGetTowerData";

const useCopyTower = () => {
  const getTowerData = useGetTowerData();
  const addNewTab = useAddNewTab();
  const copyTower = (towerName) => {
    let towerDetails = getTowerData(towerName);
    addNewTab(towerDetails);
  };

  return copyTower;
};

export default useCopyTower;
