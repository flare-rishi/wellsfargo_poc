import React from "react";
import BreadCrumbController from "../breadCrumb/BreadCrumbController";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
    return (
        <div className="layout-data-discovery">
            <BreadCrumbController />

            <Outlet />
        </div>
    );
};

export default Layout;
