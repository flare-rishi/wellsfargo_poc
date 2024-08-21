import React from "react";
import "./Skeleton.css";

const Skeleton = () => {
    return (
        <div className="loading-main">
            <svg className="loading-svg" viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    );
    // return <div className="skeleton-header"></div>;
};

export default Skeleton;
{
    /* <div class="skeleton">
  <div class="skeleton-header"></div>
  <div class="skeleton-body">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
  </div>
</div>; */
}
