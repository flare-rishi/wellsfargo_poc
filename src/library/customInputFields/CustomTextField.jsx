import React from "react";
import TextField from "@mui/material/TextField";
import { OUTLINED, SMALL } from "../../constants/constants";
import { Margin } from "@mui/icons-material";
import { color } from "framer-motion";

const CustomTextField = ({
    value = "",
    defaultValue,
    textFieldDisabled = [],
    label,
    variant = OUTLINED,
    size = SMALL,
    fullWidth = false,
    password = false,
    placeholder = "",
    disabled = false,
    name,
    isRequired = false,
    minLength = 0,
    maxLength = 0,
    onChange,
    onBlur,
    useCustomInput = true,
}) => {
    const textFieldProps = {
        value,
        label,
        variant,
        size,
        fullWidth,
        type: password ? "password" : "text",
        placeholder,
        disabled: disabled || textFieldDisabled.includes(name),
        name,
        required: isRequired,
        inputProps: {
            minLength: minLength > 0 ? minLength : undefined,
            maxLength: maxLength > 0 ? maxLength : undefined,
        },
        InputLabelProps: {
            shrink: true,
        },
    };

    //custom textfiled styling

    const customTextFieldStyle = {
        marginTop: "10px",
        marginLeft: "0px",
        marginRight: "10px",
        color: "rgb(64, 64, 64)",
    };

    // Conditionally add defaultValue if it is provided
    if (defaultValue !== undefined) {
        textFieldProps.defaultValue = defaultValue;
    }
    if (onBlur) {
        textFieldProps.onBlur = () => onBlur(name);
    }

    const handleChange = (event) => {
        if (onChange) {
            onChange(event, name);
        }
    };

    return <TextField {...textFieldProps} sx={useCustomInput && customTextFieldStyle} onChange={handleChange} />;
};

export default CustomTextField;
