import React from "react";
import "./ButtonWithIconOnLeft.css";
import { IoIosGitBranch } from "react-icons/io";
const ButtonWithIconOnLeft = ({ handleClick }) => {
  return (
    <div className="icon-left-button-main" onClick={() => handleClick(true)}>
      <IoIosGitBranch className="icon-div" />
      <p className="paragraph">+ New Fork</p>
    </div>
  );
};

export default ButtonWithIconOnLeft;
