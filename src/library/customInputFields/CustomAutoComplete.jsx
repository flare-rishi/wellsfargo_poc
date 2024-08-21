import React, { useState } from "react";
import { Autocomplete, Chip, TextField, Input } from "@mui/material";

const CustomAutoComplete = ({ value, options, checked, name, placeholder = "", updateInput, editable, disabled }) => {
    const [editChipIndex, setEditChipIndex] = useState(null);
    const [editChipValue, setEditChipValue] = useState("");

    const handleChange = (event, newValue) => {
        const processedValue = newValue.map((val) => {
            if (val.includes("=")) {
                const [leftPart, rightPart] = val.split("=");
                if (options.includes(leftPart.trim())) {
                    return `${leftPart.trim()}=${rightPart.trim()}`;
                }
            }
            return val;
        });

        const customEvent = {
            ...event,
            target: {
                ...event.target,
                name: name,
                value: processedValue,
            },
        };
        updateInput(customEvent);
    };

    const handleChipClick = (index, option) => {
        setEditChipIndex(index);
        setEditChipValue(option);
    };

    const handleChipEdit = (event) => {
        setEditChipValue(event.target.value);
    };

    const handleChipEditComplete = (index) => {
        const newValue = [...value];
        newValue[index] = editChipValue;
        handleChange({}, newValue);
        setEditChipIndex(null);
        setEditChipValue("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Backspace" && event.target.value === "") {
            event.stopPropagation();
        }
    };

    const getOptionLabel = (option) => {
        const foundChip = value.find((chip) => chip.startsWith(`${option}=`));
        return foundChip || option;
    };

    const filteredOptions = options.filter(
        (option) => !value.some((chip) => chip.startsWith(`${option}=`) || chip === option)
    );

    return (
        <Autocomplete
            multiple
            disablePortal
            freeSolo
            options={filteredOptions}
            value={value || []}
            disabled={disabled}
            onChange={handleChange}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={name}
                    variant="outlined"
                    placeholder={placeholder}
                    size="small"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onKeyDown={handleKeyDown}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <div key={index}>
                        {editChipIndex === index ? (
                            <Input
                                value={editChipValue}
                                onChange={(event) => {
                                    handleChipEdit(event);
                                }}
                                onBlur={() => handleChipEditComplete(index)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleChipEditComplete(index);
                                    } else if (event.key === "Backspace") {
                                        event.stopPropagation();
                                    }
                                }}
                                autoFocus
                                size="small"
                                sx={{ width: "100px", margin: "5px" }}
                            />
                        ) : (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                                onClick={() => {
                                    if (editable === true) handleChipClick(index, option);
                                }}
                                sx={{ margin: "5px", cursor: `${editable === true ? "pointer" : "default"}` }}
                            />
                        )}
                    </div>
                ))
            }
        />
    );
};

export default CustomAutoComplete;
