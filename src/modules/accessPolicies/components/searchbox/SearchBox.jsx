import { useState } from "react";
import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useReactFlow } from "reactflow";
import { useSelector } from "react-redux";
import { selectSearchedPolicy } from "../../slices/crud/crudSlice";
function SearchBox({ options, handleSearch }) {
  const searchedPolicy = useSelector(selectSearchedPolicy);
  const [policyQuery, setPolicyQuery] = useState("");
  const reactFlow = useReactFlow();
  const handleInputChange = (event, newValue) => {
    handleSearch(newValue);
    setPolicyQuery(newValue);
  };

  return (
    <Autocomplete
      freeSolo
      id="free-solo-2-demo"
      sx={{ border: "none" }}
      size="small"
      value={policyQuery}
      onChange={(event, newValue) => {
        if (newValue != null) reactFlow.fitView({ duration: 400 });
      }}
      inputValue={policyQuery}
      onInputChange={handleInputChange}
      options={options}
      renderInput={(params) => <TextField {...params} label="Search Policy" />}
    />
  );
}

export default SearchBox;
