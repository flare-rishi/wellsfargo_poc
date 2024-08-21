import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { SMALL } from "../../constants/constants";
import { checkObjectIsValid } from "../../utilities/utilities";

export default function CustomBasicDropDown({ options, handleChange, value, isDisabled }) {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth disabled={isDisabled} size={SMALL}>
                <InputLabel id="demo-simple-select-label">select user</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label="select user"
                    onChange={handleChange}
                >
                    {checkObjectIsValid(options) &&
                        options.map((option) => {
                            return <MenuItem value={option}>{option}</MenuItem>;
                        })}
                </Select>
            </FormControl>
        </Box>
    );
}
