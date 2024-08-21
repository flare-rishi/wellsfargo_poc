import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "./ViewAllButton.css";

const ViewAllButton = () => {
  return (
    <div className="view-button-main-div">
      <p className="view-all"> View all</p>
      <MdOutlineKeyboardArrowRight className="right-arrow" />
    </div>
  );
};

export default ViewAllButton;
