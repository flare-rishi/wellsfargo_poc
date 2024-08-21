//
//
//Note : we need to remove fork name validation from here once backend validate the fork names in response

import React, { useEffect, useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import "./FormModal.css";
import CustomTextField from "../../customInputFields/CustomTextField";
import { RadioGroup, FormControlLabel, Radio, IconButton, Button, TextField, Typography } from "@mui/material";

import Skeleton from "../../../modules/skeleton/Skeleton";
import CustomAutoComplete from "../../customInputFields/CustomAutoComplete";
import { Add, Remove, Edit } from "@mui/icons-material";
import useGetSerachParams from "../../../modules/dataDiscovery/hooks/useLocationHooks/useGetSearchParams";
import { useDispatch, useSelector } from "react-redux";
import {
    selectCreateForkError,
    selectCreateForkLoading,
    selectForkModalData,
    selectForkModalDataLoading,
    selectForkModalError,
    selectForkModalType,
    selectHighlightTableCircle,
    selectTablePath,
    selectTablePathError,
    selectTablePathLoading,
    selectTableSchema,
    selectTableVersionData,
    selectUpdateForkError,
    selectUpdateForkLoading,
} from "../../../modules/dataDiscovery/slices/tableLevelSlice/tableLevelSlice";
import { checkObjectIsValid } from "../../../utilities/utilities";

import { useNavigate, useParams } from "react-router-dom";
import { COLUMNS, DATA, EDITME, GENERATIONS, NAME, TITLE, VERSIONS } from "../../../constants/constants";
import FormSubmitAnimation from "../../formSubmitAnimation/FormSubmitAnimation";
import ForkFormErrorMsg from "../../forkFormErrorMsg/ForkFormErrorMsg";
import toast from "react-hot-toast";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800, // Adjusted for better space
    bgcolor: "background.paper",
    border: "none",
    p: 4,
};

const INPUTDATA = "inputData";
const SELECTEDRADIO = "selectedRadio";

export default function FormModal({ open, handleClose }) {
    //
    //
    //

    const navigate = useNavigate();
    const dispatch = useDispatch();
    //
    const forkModalData = useSelector(selectForkModalData);
    const type = useSelector(selectForkModalType);
    const schema = useSelector(selectTableSchema);
    const selectedVersion = useSelector(selectHighlightTableCircle);
    const tablePathLoading = useSelector(selectTablePathLoading);
    const forkModalDataLoading = useSelector(selectForkModalDataLoading);
    const tablePath = useSelector(selectTablePath);
    const createForkError = useSelector(selectCreateForkError);
    const forkModalDetailsError = useSelector(selectForkModalError);
    const tablePathError = useSelector(selectTablePathError);
    const createForkLoading = useSelector(selectCreateForkLoading);
    const updateForkLoading = useSelector(selectUpdateForkLoading);
    const updateForkError = useSelector(selectUpdateForkError);
    // const deleteForkLoading = useSelector(selectDeleteForkLoading);
    // const deleteForkError = useSelector(selectDeleteForkError);

    //
    //
    //
    const { wareHouse, domainName, dataSetName, tableName } = useParams();
    const { versionId, forkId } = useGetSerachParams();
    //
    //
    const [disableButtons, setDisableButtons] = useState();
    const [isError, setError] = useState(null);
    const [isInvalidName, setInvalidName] = useState(false);
    const [columns, setColumns] = useState([]);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditMode, setIsEditMode] = useState(type !== "edit");
    const [formInputs, setFormInputs] = useState(null);
    const [invalidNameMsg, setInvalidNameMsg] = useState(null);
    const versionData = useSelector(selectTableVersionData);

    //
    useEffect(() => {
        if (createForkError || forkModalDetailsError || tablePathError || updateForkError) {
            setError(
                createForkError
                    ? createForkError
                    : forkModalDetailsError
                    ? forkModalDetailsError
                    : tablePathError
                    ? tablePathError
                    : updateForkError
            );
        } else {
            setError(null);
        }
    }, [createForkError, forkModalDetailsError, tablePathError, updateForkError]);

    useEffect(() => {
        if (createForkLoading || updateForkLoading) {
            setDisableButtons(true);
        } else {
            setDisableButtons(false);
        }
    }, [createForkLoading, updateForkLoading]);
    ///

    useEffect(() => {
        if (!forkModalDataLoading && type == "edit") {
            setFormInputs({ ...forkModalData });
        }
    }, [forkModalData, forkModalDataLoading]);
    //
    //
    useEffect(() => {
        if (!tablePathLoading && type !== "edit") {
            setFormInputs({
                [TITLE]: EDITME,
                [GENERATIONS]: versionId,
                [COLUMNS]: [{ [VERSIONS]: versionId, path: tablePath }],
            });
        }
    }, [tablePath, tablePathLoading]);

    //
    //
    //it gives the options for creations of fork in include/Exclude section
    function getColumns() {
        let rows = schema[DATA];
        let tempCols = [];
        for (let i = 0; i < rows.length; i++) {
            tempCols.push(rows[i]["Column"]);
        }
        setColumns(tempCols);
    }

    //
    //
    //
    //for all the other field other than common inputs we are using this
    const updateInput = (event) => {
        const { name, value } = event.target;
        let newValue = value;

        setFormInputs((prevState) => ({
            ...prevState,
            [name]: newValue || undefined,
        }));
    };

    //
    //
    //
    const addViewForm = () => {
        setFormInputs((prevState) => ({
            ...prevState,
            [COLUMNS]: [...(prevState[COLUMNS] || []), {}],
        }));
    };

    //
    //
    //
    //
    const handleViewFormChange = (index, event) => {
        const { name, value } = event.target;

        setFormInputs((prevState) => {
            let newViewForms = [...(prevState[COLUMNS] || [])];
            if (value.length !== 0 && value !== null && value !== undefined) {
                newViewForms[index] = { ...newViewForms[index], [name]: value };
            } else {
                let tempViewForms = { ...newViewForms[index] };
                delete tempViewForms[name];
                newViewForms[index] = { ...tempViewForms };
            }

            return {
                ...prevState,
                [COLUMNS]: newViewForms,
            };
        });
    };

    ///
    //
    //
    //function invokes when a click is done on minus icon
    const removeViewForm = (index) => {
        setFormInputs((prevState) => {
            const newViewForms = [...(prevState[COLUMNS] || [])];
            newViewForms.splice(index, 1);
            if (newViewForms.length !== 0) {
                return {
                    ...prevState,
                    [COLUMNS]: newViewForms,
                };
            } else {
                const newFormInputs = { ...prevState };
                delete newFormInputs[COLUMNS];
                return newFormInputs;
            }
        });
    };
    //
    //
    //
    //

    const convertForkFormData = (formInputs) => {
        let newformInputs = {};
        let newColumns = [];
        if (formInputs) {
            let columns = formInputs[COLUMNS];
            for (let i = 0; i < columns.length; i++) {
                let colobj = { ...columns[i] };
                if (colobj[SELECTEDRADIO]) {
                    let selRadio = colobj[SELECTEDRADIO];
                    if (selRadio === "include") {
                        if (colobj["exclude"]) delete colobj["exclude"];
                    } else {
                        if (colobj["include"]) delete colobj["include"];
                    }
                    delete colobj[SELECTEDRADIO];
                }
                newColumns[i] = { ...colobj };
            }
        }

        newformInputs = { ...formInputs, [COLUMNS]: [...newColumns] };
        return newformInputs;
    };

    //
    //
    //
    //submits the form
    const handleFormSubmit = (event) => {
        event.preventDefault();
        toast.error("cannot submit");
    };
    //
    //

    //

    //

    const handleTitleEditClick = () => {
        if (isEditMode === true) {
            setIsEditingTitle(true);
        }
    };

    //
    //

    const checkNameValid = (name) => {
        if (name.toLowerCase() == EDITME.toLowerCase() || name.includes(" ") || name.toLowerCase().includes("edit")) {
            setInvalidNameMsg("Invalid name");
            setInvalidName(true);
            return false;
        } else {
            //Note : we need to remove this once backend validate the names in response
            if (versionData)
                for (let key in versionData) {
                    if (versionData[key] && versionData[key]["forks"]) {
                        for (let i = 0; i < versionData[key]["forks"].length; i++) {
                            let forkName = Object.keys(versionData[key]["forks"][i])[0];
                            if (forkName !== forkId) {
                                if (forkName == name) {
                                    setInvalidNameMsg("Fork name already exist");
                                    setInvalidName(true);
                                    return false;
                                }
                            }
                        }
                    }
                }
            setInvalidName(false);
            return true;
        }
    };

    //
    //
    //
    const handleTitleChange = (event) => {
        checkNameValid(event.target.value);
        updateInput(event);
    };
    //
    //
    //

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
    };

    const handleEditFork = () => {
        setIsEditMode(true);
    };
    //

    //
    //
    useEffect(() => {
        if (checkObjectIsValid(schema)) getColumns();
    }, [schema]);
    //
    //
    //
    //

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => handleClose(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <div className="form-modal-main-div div-background-border" style={style}>
                    {!formInputs ? (
                        <Skeleton />
                    ) : (
                        <>
                            <form className="font-color" onSubmit={handleFormSubmit}>
                                {!isError ? (
                                    <>
                                        <div className="new-fork-form-header">
                                            <div>
                                                {type !== "edit" || isEditingTitle ? (
                                                    <TextField
                                                        value={formInputs[TITLE]}
                                                        label="New Fork Name"
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        disabled={disableButtons}
                                                        name={NAME}
                                                        onChange={handleTitleChange}
                                                        onBlur={handleTitleBlur}
                                                        onKeyDown={(event) => {
                                                            if (event.key === "Enter") setIsEditingTitle(false);
                                                        }}
                                                        required
                                                        autoFocus
                                                        error={isInvalidName ? true : false}
                                                        helperText={isInvalidName ? invalidNameMsg : null}
                                                    />
                                                ) : (
                                                    <div onDoubleClick={handleTitleEditClick}>
                                                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                                                            {formInputs?.[TITLE]}
                                                        </Typography>
                                                    </div>
                                                )}
                                            </div>
                                            {type === "edit" && (
                                                <IconButton onClick={handleEditFork}>
                                                    <Edit />
                                                </IconButton>
                                            )}
                                        </div>
                                        <hr />

                                        <div style={{ height: "100%", width: "100%" }}>
                                            <ViewForm
                                                key={0}
                                                index={0}
                                                options={columns}
                                                viewForm={formInputs?.[COLUMNS]?.[0] || {}}
                                                onChange={handleViewFormChange}
                                                onRemove={removeViewForm}
                                                isEditable={isEditMode && !disableButtons}
                                            />
                                        </div>
                                        <div className="view-form-section">
                                            {formInputs[COLUMNS] &&
                                                formInputs[COLUMNS].length > 0 &&
                                                formInputs[COLUMNS].map(
                                                    (viewForm, index) =>
                                                        index !== 0 && (
                                                            <ViewForm
                                                                key={index}
                                                                index={index}
                                                                viewForm={viewForm}
                                                                onChange={handleViewFormChange}
                                                                onRemove={removeViewForm}
                                                                isEditable={isEditMode && !disableButtons}
                                                            />
                                                        )
                                                )}
                                        </div>
                                    </>
                                ) : (
                                    <ForkFormErrorMsg msg={isError} />
                                )}
                                <div className="new-fork-button-box">
                                    <div className="new-fork-left-buttons">
                                        <div className="new-fork-remove-icon-div">
                                            <IconButton
                                                style={{ paddingLeft: "0px", marginTop: "10px", visibility: "hidden" }}
                                            >
                                                <Remove />
                                            </IconButton>
                                        </div>
                                        <div className="view-form-add-button">
                                            <IconButton
                                                onClick={addViewForm}
                                                sx={{ paddingLeft: "0px" }}
                                                disabled={!isEditMode || disableButtons}
                                                style={{ visibility: isError ? "hidden" : "visible" }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className="new-fork-form-buttons">
                                        <Button
                                            variant="outlined"
                                            disabled={disableButtons}
                                            onClick={() => handleClose(false)}
                                        >
                                            {isEditMode ? "Close" : "Cancel"}
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant={disableButtons ? "none" : "outlined"}
                                            disabled={!isEditMode || isInvalidName}
                                            style={{ display: isError ? "none" : "inline" }}
                                        >
                                            {disableButtons ? (
                                                <FormSubmitAnimation />
                                            ) : type == "edit" ? (
                                                "Save"
                                            ) : (
                                                "Submit"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </Fade>
        </Modal>
    );
}

// the other tables is reffered as view
//
//
//
//
const ViewForm = ({ index, viewForm, onChange, onRemove, options = [], isEditable, disabledTextFields = [] }) => {
    const handleFieldChange = (event) => {
        onChange(index, event);
    };

    return (
        <div className="view-form">
            <div className="new-fork-remove-icon-div">
                <IconButton
                    onClick={() => onRemove(index)}
                    style={{ paddingLeft: "0px", marginTop: "10px", visibility: `${index === 0 && "hidden"}` }}
                    disabled={!isEditable}
                >
                    <Remove />
                </IconButton>
            </div>
            <CommonInputs
                options={options}
                disabledTextFields={disabledTextFields}
                updateInput={handleFieldChange}
                formInputs={viewForm}
                isPathEditable={isEditable}
            />
        </div>
    );
};

//its the box which have the common part (path, version , include/exclude)
//
//
//
//
function CommonInputs({ options, updateInput, formInputs, isPathEditable = true, disabledTextFields }) {
    return (
        <>
            <div className="newfork-form-component-box">
                <div className="path-box">
                    <CustomTextField
                        value={formInputs["path"] || ""}
                        textFieldDisabled={disabledTextFields}
                        label="Path"
                        placeholder="Enter Table Path"
                        isRequired={true}
                        onChange={updateInput}
                        name="path"
                        disabled={!isPathEditable}
                    />
                </div>
                <div className="path-box">
                    <CustomTextField
                        value={formInputs["version"] || ""}
                        textFieldDisabled={disabledTextFields}
                        label="Version"
                        placeholder="Enter Table version"
                        isRequired={true}
                        onChange={updateInput}
                        name="version"
                        disabled={!isPathEditable}
                    />
                </div>
                <div className="include-exclude-box">
                    <IncludeExclude
                        formInputs={formInputs}
                        updateInput={updateInput}
                        options={options}
                        isEditable={isPathEditable}
                    />
                </div>
            </div>
        </>
    );
}

// if Using it more than one place then put it as a seperate component
//
//
//
//
//
function IncludeExclude({ formInputs, updateInput, options, isEditable }) {
    const [selectedRadio, setSelectedRadio] = useState(formInputs["exclude"] ? "exclude" : "include");

    const handleRadioChange = (event) => {
        const { value } = event.target;
        const customEvent = { target: { name: selectedRadio, value: formInputs[selectedRadio] || [] } };
        updateInput(customEvent);
        updateInput({ target: { name: SELECTEDRADIO, value: value } });
        setSelectedRadio(value);
    };

    return (
        <div className="include-exclude-tiles">
            <RadioGroup
                row
                name="include-exclude"
                value={selectedRadio}
                onChange={handleRadioChange}
                sx={{
                    "& .MuiFormControlLabel-label": { fontSize: "0.75rem" },
                    "& .MuiSvgIcon-root": { fontSize: "1rem" },
                }}
            >
                <FormControlLabel value="include" control={<Radio />} label="Include" disabled={!isEditable} />
                <FormControlLabel value="exclude" control={<Radio />} label="Exclude" disabled={!isEditable} />
            </RadioGroup>

            <CustomAutoComplete
                value={formInputs[selectedRadio] || []}
                options={options}
                name={selectedRadio}
                updateInput={updateInput}
                // editable={!isEditable}
                editable={true}
                disabled={!isEditable}
            />
        </div>
    );
}
