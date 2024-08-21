import React, { useEffect, useState } from "react";
import TableModal from "./TableModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTableModalData,
  updateTableEditModalData,
} from "../../slices/crud/crudSlice";
import { selectData } from "../../slices/dataSlice/dataSlice";
import UseEditTableLevelPii from "../../hooks/useEditTableLevelPii/useEditTableLevelPii";

const TableModalController = () => {
  const modalData = useSelector(selectTableModalData);
  const dataJson = useSelector(selectData);

  const [tableInputs, setTableInputs] = useState({
    pii: dataJson.pii || "",
  });
  const [isEdited, setIsEdited] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [oldCode, setOldCode] = useState();
  const [newCode, setNewCode] = useState();
  const [isInputsChanged, setIsInputsChanged] = useState(false);
  const [checked, setChecked] = useState(true);

  const dispatch = useDispatch();
  const editPii = UseEditTableLevelPii();

  const updateInput = (newValue, key) => {
    setTableInputs((prevState) => ({
      ...prevState,
      [key]: newValue,
    }));
  };

  const handleApply = () => {
    editPii(tableInputs.pii);
    setChecked(!checked);
    // handleCloseTableModal();
  };
  const handleChange = () => {
    setTableInputs({
      pii: dataJson.pii || "",
    });
    setChecked(!checked);
  };
  const handleCloseTableModal = () => {
    dispatch(updateTableEditModalData({}));
    setTableInputs();
    setChecked();
  };

  function handleRevert() {
    editPii(dataJson["preEdit"]);
  }
  function handleOldCode() {
    setOldCode(dataJson["preEdit"]);
  }
  function handleNewCode() {
    setNewCode(dataJson.pii);
  }
  useEffect(() => {
    if (dataJson.preEdit) {
      setIsEdited(true);
      handleOldCode();
      handleNewCode();
    }
  }, [modalData, dataJson]);

  useEffect(() => {
    // Compare the previous and current values of pii to check for changes
    const isPiiChanged =
      JSON.stringify(tableInputs.pii) !== JSON.stringify(dataJson.pii);
    // Update the state to reflect if any changes have been made
    setIsInputsChanged(isPiiChanged);
  }, [tableInputs.pii]);
  useEffect(() => {
    return () => {
      setNewCode();
      setOldCode();
      setShowDiff(false);
      setIsEdited(false);
      dispatch(updateTableEditModalData({}));
    };
  }, []);
  return (
    <>
      <TableModal
        modalData={modalData}
        tableInputs={tableInputs}
        updateInput={updateInput}
        handleCloseTableModal={handleCloseTableModal}
        handleApply={handleApply}
        isEdited={isEdited}
        showDiff={showDiff}
        setShowDiff={setShowDiff}
        oldCode={oldCode}
        newCode={newCode}
        handleRevert={handleRevert}
        handleChange={handleChange}
        checked={checked}
        isInputsChanged={isInputsChanged}
      />
    </>
  );
};

export default TableModalController;
