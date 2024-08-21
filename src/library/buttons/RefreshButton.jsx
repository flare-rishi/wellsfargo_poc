import React from "react";
import { MdOutlineRefresh } from "react-icons/md";
import "./RefreshButton.css";

const RefreshButton = ({ handleClick }) => {
    return (
        <div className="refresh-button" onClick={handleClick}>
            <MdOutlineRefresh className="refresh-icon" />
        </div>
    );
};

export default RefreshButton;
