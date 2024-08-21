import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import { handleOpenEditModal, selectActiveTab, updateEditModalData } from "../../slices/crud/crudSlice";
import useEditPolicy from "../../hooks/useEditPolicy/useEditPolicy";
import useEditTower from "../../hooks/useEditTower";

import useGetOptions from "../../hooks/useGetOptions/getOptions";
import useCheckUniqueNames from "../../hooks/useCheckUniqueNames/useCheckUniqueNames";
import { selectSplitViewData, selectUniqueNodeNames, selectUniqueTowerNames } from "../../slices/dataSlice/dataSlice";
import {
    selectEditedNodes,
    selectEditedTowers,
    updateEditedNodes,
    updateEditedTowers,
} from "../../slices/save/saveSlice";
import { EDITME, STRING } from "../../../../constants/constants";

const EditModalController = ({ selectedNodes, obj, split }) => {
    const dispatch = useDispatch();

    const [warning, setWarning] = useState(null);
    const [nodeOptions, setNodesOptions] = useState([]);
    const [oldCode, setOldCode] = useState();
    const [newCode, setNewCode] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [showDiff, setShowDiff] = useState(false);
    const [isInputsChanged, setIsInputsChanged] = useState(true);
    const [checked, setChecked] = useState(true);
    const [inputNameField, setInputNameField] = useState(false);
    const [invalidJsonMessage, setInvalidJsonMessage] = useState();
    const [inputs, setInputs] = useState({
        pii_visibility: obj.pii_visibility || [],

        ...(obj?.type === "node" ? { nameInput: obj?.policyName } : { nameInput: obj?.name }),

        ...(obj?.type === "node" && { memberOfInput: obj?.member_of || [] }),
    });

    const [textArea, setTextArea] = useState(() => {
        const masks = obj?.masks ? JSON.stringify(obj.masks) : "{}";
        const filter = obj?.filter === "" ? '""' : obj.filter ? JSON.stringify(obj.filter) : '""';

        return `{
 "masks":${masks},
 "filter":${filter}
}`;
    });

    const { getOptions } = useGetOptions();
    const editPolicy = useEditPolicy();
    const editTower = useEditTower();
    const checkUniqueNames = useCheckUniqueNames();

    const uniqueNodeNames = useSelector(selectUniqueNodeNames);
    const uniqueTowerNames = useSelector(selectUniqueTowerNames);
    const editedNodes = useSelector(selectEditedNodes);
    const editedTowers = useSelector(selectEditedTowers);
    const activeTab = useSelector(selectActiveTab);

    const splitViewData = useSelector(selectSplitViewData);

    const handleOnChange = () => {
        setChecked(!checked);
        handleChange();
    };

    const handleChange = () => {
        setInputNameField(false);
        setInputs({
            pii_visibility: obj.pii_visibility || [],
            ...(obj?.type === "node" ? { nameInput: obj?.policyName } : { nameInput: obj?.name }),

            ...(obj?.type === "node" && { memberOfInput: obj?.member_of || [] }),
        });
        setTextArea(
            `{
 "masks":${obj?.masks ? JSON.stringify(obj.masks) : "{}"},
 "filter":${obj?.filter === "" ? '""' : obj.filter ? JSON.stringify(obj.filter) : '""'}
}`
        );

        setInvalidJsonMessage();
        setWarning();
    };

    useEffect(() => {
        if (obj.type === "node") {
            setNodesOptions(getOptions(obj.policyLayer, obj.policyName));
        }
    }, [obj, selectedNodes]);

    useEffect(() => {
        handleChange();
        setChecked(true);
    }, [splitViewData]);

    //closing the edit modal and resetting the states

    const closeEditModal = () => {
        dispatch(handleOpenEditModal());
        dispatch(updateEditModalData(null));
        setInputs({
            maskInput: null,
            memberOfInput: [],
            setTextArea: null,
        });
        setWarning();
        setInvalidJsonMessage();
    };

    //all the changes will apply when apply button is clicked

    const handleEditApply = () => {
        //checking the name if it is empty or not
        if (inputs?.nameInput.trim().length === 0) {
            setWarning("Name can't be empty");
            return;
        }

        let parsedObj;
        //creating an parsed obj from the textArea  that converts the json object into js object
        try {
            parsedObj = JSON.parse(textArea);
            //set error message to null
            setInvalidJsonMessage();
        } catch (error) {
            // this handle when  the in correct format of json is entered  and throws an error
            // sets an error and displays in the ui
            setInvalidJsonMessage("Invalid JSON format. Please ensure that the JSON structure is correct.");
            return;
        }
        //if the name includes EDIT-Me in it it throws an error
        if (inputs.nameInput.trim().includes(EDITME)) {
            toast.error(`${inputs.nameInput.trim()} is not a valid name`);
            setWarning(`${inputs.nameInput.trim()} is not a valid name`);
            setInputNameField(true);
            return;
        }

        // if the user entered name is different from the original name then it checks whether the name is unique or not

        if (obj?.policyName !== inputs?.nameInput.trim()) {
            //checkUniqueNames is responsible for the checking the
            if (obj.type === "node" && checkUniqueNames(uniqueNodeNames, inputs.nameInput.trim())) {
                //if it is  not unique
                toast.error("Name should be unique");
                setWarning("Name should be unique");
                setInputNameField(true);
                return;
            } else {
                setWarning();
            }
        }
        if (obj.name !== inputs?.nameInput.trim()) {
            if (obj.type === "tower" && checkUniqueNames(uniqueTowerNames, inputs.nameInput.trim())) {
                toast.error("Name should be unique");
                setWarning("Name should be unique");
                setInputNameField(true);

                return;
            } else {
                setWarning();
            }
        }

        let maskObj;
        if (Object.entries(parsedObj.masks).length > 0) {
            maskObj = parsedObj.masks;
        } else {
            maskObj = null;
        }

        if (obj.type === "node") {
            editPolicy(
                obj.policyLayer,
                obj.policyName.trim(),
                inputs.nameInput.trim(),
                inputs.memberOfInput,
                inputs.pii_visibility,
                parsedObj.filter,
                maskObj,
                split
            );

            let newEditedNodes = [...editedNodes];
            newEditedNodes.push({
                name: inputs.nameInput.trim(),
                activeTowerName: activeTab,
            });

            dispatch(updateEditedNodes(newEditedNodes));
        } else if (obj.type === "tower") {
            editTower(inputs.nameInput.trim(), parsedObj.filter, maskObj, inputs.pii_visibility);
            let newEditedNodes = [...editedTowers];
            newEditedNodes.push(inputs.nameInput.trim());

            dispatch(updateEditedTowers(newEditedNodes));
        }
        setChecked(!checked);

        // dispatch(handleOpenEditModal());
        // setInputs({ maskInput: null, memberOfInput: [], setTextArea: null });
    };

    const updateInput = (newValue, key) => {
        setInputs((prevState) => ({
            ...prevState,
            [key]: newValue,
        }));
    };

    useEffect(() => {}, [splitViewData]);

    const toggleInputFiled = () => {
        setInputNameField(!inputNameField);
    };

    function handleSetOldCode(type) {
        if (type === "node") {
            setOldCode({
                name: obj.preEdit.name,
                pii_visibility: obj.preEdit.pii_visibility || [],

                member_of: obj.preEdit.member_of || "",
                masks: obj.preEdit.masks || "",
                filter: obj.preEdit.filter ? obj.preEdit.filter : "",
            });
        } else if (type === "tower") {
            setOldCode({
                name: obj.preEdit.name,
                pii_visibility: obj.preEdit.pii_visibility || [],
                masks: obj.preEdit.masks || "",
                filter: obj.preEdit.filter ? obj.preEdit.filter : "",
            });
        }
    }

    function handleSetNewCode(type) {
        if (type === "node") {
            setNewCode({
                name: obj.policyName,
                pii_visibility: obj.pii_visibility || [],
                member_of: obj.member_of || "",
                masks: obj.masks || "",
                filter: obj.filter || "",
            });
        } else if (type === "tower") {
            setNewCode({
                name: obj.name,
                pii_visibility: obj.pii_visibility || [],
                masks: obj.masks || "",
                filter: obj.filter || "",
            });
        }
    }

    // useEffect(() => {
    //     // Function to check if any input value has changed
    //     const checkInputChanges = () => {
    //         // Compare each key in obj with corresponding key in inputs

    //         const isInputChanged = Object.keys(obj).some((key) => {
    //             if (key === "name") {
    //                 console.log("267 nameInput ", inputs.nameInput.trim() !== obj.name);
    //                 return inputs.nameInput.trim() !== obj.name;
    //             } else if (key === "policyName") {
    //                 console.log("270 policyName ", inputs.nameInput.trim() !== obj.policyName);
    //                 return inputs.nameInput.trim() !== obj.policyName;
    //             } else if (key === "member_of") {
    //                 console.log(
    //                     "274 member_of ",
    //                     obj.type === "node" && JSON.stringify(inputs.memberOfInput) !== JSON.stringify(obj.member_of)
    //                 );
    //                 return (
    //                     obj.type === "node" && JSON.stringify(inputs.memberOfInput) !== JSON.stringify(obj.member_of)
    //                 );
    //             } else if (key === "pii_visibility") {
    //                 console.log("283 pii", !areArraysEqual(obj.pii_visibility, inputs.pii_visibility));
    //                 return !areArraysEqual(obj.pii_visibility, inputs.pii_visibility);
    //             } else if (key === "masks" || key === "filter") {
    //                 const currentTextArea = generateTextArea(obj.masks, obj.filter);
    //                 console.log("curremt text raea", textArea.localeCompare(currentTextArea));
    //                 console.log("current text area :", currentTextArea);
    //                 console.log("textArea :", textArea);
    //                 return textArea !== currentTextArea;
    //             }
    //         });

    //         // Update the state to reflect if any changes have been made
    //         setIsInputsChanged(isInputChanged);
    //     };

    //     // Function to generate text area string
    //     const generateTextArea = (masks, filter) => {
    //         let masksString = masks && Object.keys(masks).length > 0 ? JSON.stringify(masks) : `{}`;
    //         return `{\n "masks":${masksString},\n "filter":${JSON.stringify(filter) || ""} \n}`;
    //         // return `{\n "masks": ${(obj.masks && JSON.stringify(obj.masks)) || `{}`},\n "filter": "${
    //         //     JSON.stringify(obj?.stringify) || ""
    //         // }" \n}`;
    //     };

    //     function areArraysEqual(arr1, arr2) {
    //         if (Array.isArray(arr1) && Array.isArray(arr2)) {
    //             // Check if the arrays have the same length
    //             if (arr1.length !== arr2.length) {
    //                 return false;
    //             }

    //             // Sort the arrays
    //             if (arr1.length > 0 && arr2.length > 0) {
    //                 const sortedArr1 = arr1.slice().sort();
    //                 const sortedArr2 = arr2.slice().sort();

    //                 // Iterate over each element and compare them
    //                 for (let i = 0; i < sortedArr1.length; i++) {
    //                     // If any element is different, the arrays are not equal
    //                     if (sortedArr1[i] !== sortedArr2[i]) {
    //                         return false;
    //                     }
    //                 }
    //             }
    //             // If all elements are the same, the arrays are equal
    //         }
    //         return true;
    //     }
    //     // Check for changes when component mounts
    //     checkInputChanges();
    // }, [inputs, textArea]);

    useEffect(() => {
        if (obj.preEdit) {
            setIsEdited(true);
            setOldCode(obj.preEdit);

            if (obj.type === "tower") {
                handleSetNewCode("tower");
                handleSetOldCode("tower");
            } else if (obj.type === "node") {
                handleSetNewCode("node");
                handleSetOldCode("node");
            }
        }
    }, [obj]);

    return (
        <EditModal
            closeEditModal={closeEditModal}
            updateInput={updateInput}
            inputs={inputs}
            handleEditApply={handleEditApply}
            type={obj.type}
            nodeOptions={nodeOptions}
            warning={warning}
            handleOnChange={handleOnChange}
            checked={checked}
            setTextArea={setTextArea}
            textArea={textArea}
            inputNameField={inputNameField}
            toggleInputFiled={toggleInputFiled}
            isEdited={isEdited}
            oldCode={oldCode}
            newCode={newCode}
            showDiff={showDiff}
            setShowDiff={setShowDiff}
            isInputsChanged={isInputsChanged}
            invalidJsonMessage={invalidJsonMessage}
            split={split}
        />
    );
};

export default EditModalController;
