import React from "react";
import { IoIosWarning } from "react-icons/io";
import "./SnackBar.css";

const SnackBar = ({ warningMsg }) => {
  return (
    <div className="snack-bar-div  ">
      <IoIosWarning className="warning-icon" />
      <p> {warningMsg}</p>
    </div>
  );
};

export default SnackBar;
