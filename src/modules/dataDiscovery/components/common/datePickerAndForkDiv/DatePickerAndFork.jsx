import React from "react";

import "./DatePickerAndFork.css";
import { VIEWTYPETABLLE } from "../../../../../constants/constants";
import { Button } from "@mui/material";

const DatePickerAndFork = ({ type }) => {
  return (
    <div className="date-fork-main-div">
      {/* TODO render date component here */}
      <div> </div>
      {type === VIEWTYPETABLLE && <Button> fork </Button>}
    </div>
  );
};

export default DatePickerAndFork;
