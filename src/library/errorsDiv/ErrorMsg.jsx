import React from "react";
import "./Error.css";

const ErrorMsg = ({ errorMsg }) => {
  return (
    <div className="h-w-full center-content ">
      <p>{errorMsg}</p>
    </div>
  );
};

export default ErrorMsg;
