import { useState, useEffect, useRef, useCallback } from "react";
import "./Node.css";
import { Position } from "reactflow";
import DisplayNode from "./DisplayNode";
import { selectSelectedNodes } from "../../../slices/flowSlice/flowSlice";
import { useDispatch, useSelector } from "react-redux";
import usehandleClick from "../../../hooks/useHandleClick/usehandleClick";
import useGetPolicyData from "../../../hooks/useGetPolicyData/useGetPolicyData";
import {
  handleOpenEditModal,
  selectEditModalData,
  selectSearchedPolicy,
  updateEditModalData,
} from "../../../slices/crud/crudSlice";
import useCreateChildNode from "../../../hooks/useCreateChildNode/useCreateChildNode";

import useDeleteNode from "../../../hooks/useDeleteNode/useDeleteNode";
import toast from "react-hot-toast";
import useCopyPolicy from "../../../hooks/useCopyPolicy/useCopyPolicy";
import { selectEditedNodes } from "../../../slices/save/saveSlice";
import {
  selectIsSplitViewOpen,
  selectSplitViewData,
  updateSplitViewData,
} from "../../../slices/dataSlice/dataSlice";

function Node({ data }) {
  const dispatch = useDispatch();

  const searchedPolicy = useSelector(selectSearchedPolicy);
  useEffect(() => {}, [searchedPolicy]);
  const [showMenu, setShowMenu] = useState(false);
  const [editNode, setEditNode] = useState();
  const [hide, setHide] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const [towerId, setTowerId] = useState(null);
  const [interHighlight, setInterHighlight] = useState([]);
  const [unLayered, setUnLayered] = useState([]);

  const selectedNodes = useSelector(selectSelectedNodes);
  // const displayNodes = useSelector(selectDisplayNodes);
  const editedNodes = useSelector(selectEditedNodes);
  const isSplitViewOpen = useSelector(selectIsSplitViewOpen);
  const editModalData = useSelector(selectEditModalData);
  const splitViewData = useSelector(selectSplitViewData);

  const { handleClick } = usehandleClick();
  const createChildNode = useCreateChildNode();
  const copyPolicy = useCopyPolicy();
  const deleteNode = useDeleteNode();
  const getPolicyData = useGetPolicyData();

  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  //special indiction of the node that it is a selectedOne

  function highlighter() {
    if (selectedNodes[data.label]) {
      return true;
    } else return false;
  }

  const handleDeleteNodes = (value) => {
    // console.log("value = ", value);
    var msg = deleteNode(value.layer, value.label);
    if (msg === 0) {
      toast.error("cannot delete a user group");
    } else toast.success(`${value.label} node deleted`);
  };

  const handleEdit = (value) => {
    setEditNode(value);
    setShowMenu(false);
  };

  function handleCopyNode() {
    copyPolicy(data.label, data.layer);
  }

  function handleAddNodeNextLayer() {
    createChildNode(data.layer, data.label);
  }

  const handleEditModal = (value) => {
    // function call
    var obj = getPolicyData(value.label, value.layer);
    obj["type"] = "node";
    dispatch(updateEditModalData(obj));
    dispatch(handleOpenEditModal());
  };

  //handles the double the click and single on nodes

  const handleSingleClickInSplitView = (label, layer) => {
    var obj = getPolicyData(label, layer);
    obj["type"] = "node";

    // Check if the item is already in the splitViewData
    // Create a unique key for the splitViewData object based on label and layer
    const key = `${label}`;

    // Check if the item is already in the splitViewData
    const isPresent = Object.keys(splitViewData).includes(key);

    if (isPresent) {
      // If present, remove it
      const updatedSplitViewData = { ...splitViewData };
      delete updatedSplitViewData[key];
      dispatch(updateSplitViewData(updatedSplitViewData));
    } else {
      // If not present, add it
      const updatedSplitViewData = { ...splitViewData, [key]: obj };
      dispatch(updateSplitViewData(updatedSplitViewData));
    }
  };

  const handleSingleClickOnNode = (event, data) => {
    event.preventDefault();

    handleSingleClickInSplitView(data.label, data.layer);
    if (!isSplitViewOpen) {
      handleClick(data.label, data.layer);
    }
  };

  const handleDoubleOnNode = (event, data) => {
    event.preventDefault();
    if (!isSplitViewOpen) {
      handleEditModal(data);
    }
  };

  const menuTimeoutRef = useRef(null);
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
    if (data.towerId) setTowerId(data.towerId);
    else setTowerId(null);
    if (data.inter) {
      var arr = [];
      data.inter.map((interData) => {
        // console.log("interhighlight here is = ", interHighlight);
        if (!arr.includes(interData.split(":")[0])) {
          if (data.towerId) {
            if (interData.split(":")[0] != data.towerId) {
              arr.push(interData.split(":")[0]);
            }
          } else {
            arr.push(interData.split(":")[0]);
          }
          // console.log("gone here for ", interData.split(":")[0]);
        }
      });
      setInterHighlight([...arr]);
    } else {
      // console.log("gone for else also");
      setInterHighlight([]);
    }

    if (data.unlayered_childs) {
      var arr = [];
      data.unlayered_childs.map((interData) => {
        // console.log("interhighlight here is = ", interHighlight);
        if (!arr.includes(interData.split(":")[0])) {
          if (data.towerId) {
            if (interData.split(":")[0] != data.towerId) {
              arr.push(interData.split(":")[0]);
            }
          } else {
            arr.push(interData.split(":")[0]);
          }
          // console.log("gone here for ", interData.split(":")[0]);
        }
      });
      setUnLayered([...arr]);
    } else {
      // console.log("gone for else also");
      setUnLayered([]);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (Object.keys(selectedNodes).length !== 0) {
      setHide(true);
      for (let clickedNode in selectedNodes) {
        if (data.towerId) {
          if (
            selectedNodes[clickedNode]["unlayered"] &&
            selectedNodes[clickedNode]["unlayered"].includes(data.label)
          ) {
            setHide(false);
          }
        } else {
          if (isSplitViewOpen) {
            if (clickedNode === data.label) {
              setHighlight(true);
            }
            setHide(false);
          }
          if (
            clickedNode === data.label ||
            (selectedNodes[clickedNode]["parentsNodes"] &&
              selectedNodes[clickedNode]["parentsNodes"][data.layer] &&
              selectedNodes[clickedNode]["parentsNodes"][data.layer].includes(
                data.label
              )) ||
            (selectedNodes[clickedNode]["childsNodes"] &&
              selectedNodes[clickedNode]["childsNodes"][data.layer] &&
              selectedNodes[clickedNode]["childsNodes"][data.layer].includes(
                data.label
              ))
          ) {
            setHide(false);
          }
        }
      }

      setHighlight(highlighter());
    } else {
      setHide(false);
      setHighlight(false);
    }
  }, [selectedNodes, editModalData, splitViewData]);

  return (
    <>
      <DisplayNode
        handleMenu={handleMenu}
        data={data}
        showMenu={showMenu}
        handleClick={handleClick}
        hide={hide}
        highlight={highlight}
        Position={Position}
        handleDeleteNodes={handleDeleteNodes}
        handleAddNodeNextLayer={handleAddNodeNextLayer}
        handleEdit={handleEdit}
        editNode={editNode}
        handleCopyNode={handleCopyNode}
        handleEditModal={handleEditModal}
        handleSingleClickOnNode={handleSingleClickOnNode}
        handleDoubleOnNode={handleDoubleOnNode}
        hideMenuWithDelay={hideMenuWithDelay}
        handleMouseEnterMenu={handleMouseEnterMenu}
        handleMouseLeaveMenu={handleMouseLeaveMenu}
        handleMouseLeaveDiv={handleMouseLeaveDiv}
        handleMouseEnterDiv={handleMouseEnterDiv}
        editedNodes={editedNodes}
        interHighlight={interHighlight}
        towerId={towerId}
        unLayered={unLayered}
        searchedPolicy={searchedPolicy}
        isSplitViewOpen={isSplitViewOpen}
      />
    </>
  );
}

export default Node;
