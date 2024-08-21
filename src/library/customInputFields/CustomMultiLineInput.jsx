import { TextField } from "@mui/material";
import React from "react";

const CustomMultiLineInput = ({
  textAreaValue,
  checked,
  handleTextArea,
  invalidJsonMessage,
  noOfRows,
  label,
}) => {
  return (
    <TextField
      id="outlined-multiline-static"
      label={label}
      multiline
      rows={noOfRows}
      value={textAreaValue}
      disabled={checked && "disable"}
      onChange={(e) => handleTextArea(e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
      helperText={invalidJsonMessage && `${invalidJsonMessage}`}
      error={invalidJsonMessage}
    />
  );
};

export default CustomMultiLineInput;
