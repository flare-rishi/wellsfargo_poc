import React from "react";
import { Autocomplete, Button, Chip, TextField } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { PiGitDiffBold } from "react-icons/pi";

import "./TableModal.css";
import Difference from "../diff/Difference";

const TableModal = ({
    modalData,
    tableInputs,
    updateInput,
    handleCloseTableModal,
    handleApply,
    showDiff,
    setShowDiff,
    isEdited,
    oldCode,
    newCode,
    handleRevert,
    checked,
    handleChange,
    isInputsChanged,
}) => {
    return (
        <div className="overlay">
            <div className="overlay-background"></div>
            <div className={`overlay-content-edit edit-absolute `}>
                <div className="modal-header">
                    <h2>{modalData}</h2>

                    <div className="close-icon">
                        {isEdited && (
                            <PiGitDiffBold
                                className="icon-color"
                                onClick={() => {
                                    setShowDiff(!showDiff);
                                    // handleChange();
                                }}
                            />
                        )}
                        {checked ? (
                            <>
                                {!showDiff && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleChange();
                                        }}
                                    >
                                        Edit
                                    </Button>
                                )}

                                <p>
                                    <RxCross2 className="header-cross" onClick={() => handleCloseTableModal()} />
                                </p>
                            </>
                        ) : (
                            <>
                                <Button variant="outlined" onClick={() => handleChange()}>
                                    {isInputsChanged ? "Discard  " : "Back"}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleApply();
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
                    <Autocomplete
                        multiple
                        disablePortal
                        freeSolo
                        disabled={checked && "disable"}
                        id="pii-visibility-autocomplete"
                        options={tableInputs.pii}
                        value={tableInputs.pii}
                        onChange={(event, newValue) => {
                            console.log("newvalue", newValue);
                            const trimmedValues = newValue.map((value) => value.trim());
                            updateInput(trimmedValues, "pii");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="pii"
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

                    // <TextField
                    //   id="outlined-basic"
                    //   label={"pii"}
                    //   variant="outlined"
                    //   fullWidth
                    //   size="small"
                    //   value={tableInputs.pii}
                    //   placeholder="pii"
                    //   onChange={(event) => {
                    //     updateInput(event.target.value, "pii");
                    //   }}
                    // />
                )}{" "}
                {/* <div className="btn-div">
          <Button variant="outlined" onClick={() => handleCloseTableModal()}>
            Cancel
          </Button>
          {!showDiff && (
            <Button variant="contained" onClick={() => handleApply()}>
              apply
            </Button>
          )}
          {showDiff && (
            <Button variant="contained" onClick={() => handleRevert()}>
              revert
            </Button>
          )}
        </div> */}
            </div>
        </div>
    );
};

export default TableModal;
