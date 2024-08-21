import React from "react";
import "./EditModal.css";
import { Autocomplete, Button, TextField, Chip } from "@mui/material";
import { PiGitDiffBold } from "react-icons/pi";
import Difference from "../diff/Difference";
import { RxCross2 } from "react-icons/rx";

// import Switch from "@mui/material/Switch";

const EditModal = ({
    closeEditModal,
    inputs,
    updateInput,
    handleEditApply,
    type,
    nodeOptions,
    warning,
    handleOnChange,
    checked,
    setTextArea,
    textArea,
    toggleInputFiled,
    inputNameField,
    isEdited,
    showDiff,
    setShowDiff,
    oldCode,
    newCode,
    isInputsChanged,
    invalidJsonMessage,
    split,
}) => {
    return (
        <div className={`${!split && "overlay"}`}>
            {!split && <div className="overlay-background"></div>}

            <div className={`overlay-content-edit  ${split ? "split-edit" : "edit-absolute"} `}>
                <div className="modal-header">
                    {!checked && inputNameField ? (
                        <TextField
                            id="outlined-basic"
                            label={(type === "node" && "nodeName") || (type === "tower" && "towerName")}
                            variant="outlined"
                            size="small"
                            value={inputs.nameInput}
                            placeholder={(type === "node" && "nodeName") || (type === "tower" && "towerName")}
                            onChange={(event) => {
                                updateInput(event.target.value, "nameInput");
                            }}
                            helperText={warning && `${warning}`}
                            error={warning}
                            autoFocus
                            onBlur={() => {
                                toggleInputFiled(); // Toggle back to text mode when input field loses focus
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    ) : (
                        <h2 onDoubleClick={() => toggleInputFiled()}>{inputs.nameInput}</h2>
                    )}

                    <div className="close-icon">
                        {isEdited && (
                            <PiGitDiffBold
                                className="icon-color"
                                onClick={() => {
                                    setShowDiff(!showDiff);
                                }}
                            />
                        )}
                        {checked ? (
                            <>
                                {!showDiff && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleOnChange();
                                        }}
                                    >
                                        Edit
                                    </Button>
                                )}
                                {!split && (
                                    <p>
                                        <RxCross2 className="header-cross" onClick={() => closeEditModal()} />
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <Button variant="outlined" onClick={() => handleOnChange()}>
                                    {isInputsChanged ? "Discard  " : "Cancel"}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleEditApply();
                                    }}
                                    disabled={!isInputsChanged}
                                >
                                    Apply
                                </Button>{" "}
                            </>
                        )}
                    </div>
                </div>

                {showDiff ? (
                    <Difference oldCode={oldCode} newCode={newCode} />
                ) : (
                    <>
                        <Autocomplete
                            multiple
                            disablePortal
                            freeSolo
                            id="pii-visibility-autocomplete"
                            options={inputs.pii_visibility}
                            value={inputs.pii_visibility}
                            disabled={checked && "disable"}
                            onChange={(event, newValue) => {
                                console.log("newvalue", newValue);
                                const trimmedValues = newValue.map((value) => value.trim());
                                updateInput(trimmedValues, "pii_visibility");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="pii_visibility"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
                                ))
                            }
                        />

                        {type === "node" && (
                            <Autocomplete
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                multiple
                                freeSolo
                                disablePortal
                                id="combo-box-demo"
                                options={nodeOptions}
                                disabled={checked && "disable"}
                                value={inputs.memberOfInput}
                                // value={memberOfInput}
                                getOptionLabel={(option) => option}
                                getOptionSelected={(option, value) => option === value}
                                onChange={(event, option) => updateInput(option, "memberOfInput")}
                                sx={{ width: "auto", marginBottom: "0" }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="member of"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        // placeholder="member of"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            key={index}
                                            variant="outlined"
                                            label={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />
                        )}
                        <TextField
                            id="outlined-multiline-static"
                            label="Filter and Mask"
                            multiline
                            rows={4}
                            value={textArea}
                            disabled={checked && "disable"}
                            onChange={(e) => setTextArea(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText={invalidJsonMessage && `${invalidJsonMessage}`}
                            error={invalidJsonMessage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default EditModal;
