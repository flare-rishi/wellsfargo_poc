import React from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  {
    label: "Access Policies",
    value: "access-policies",
  },
];
const Navbar = () => {
  const location = useLocation();

  return (
    <>
      <div className="navbar-container">
        <div className="navbar">
          <Link to="/" className="navbar-logo">
            <img
              src="./dataFlare.png"
              alt="dataFlare"
              className="navbar-logo-image"
            />
          </Link>
          <div className="navbar-inner">
            {tabs &&
              tabs.map((tab, index) => (
                <Link
                  to={`/${tab.value}`}
                  className="navbar-box"
                  key={index}
                  style={{
                    backgroundColor:
                      location.pathname === `/${tab.value}` &&
                      " rgb(255, 233, 212)",
                  }}
                >
                  {tab.label}
                </Link>
              ))}
          </div>
        </div>
        <div className="line"></div>
      </div>
    </>
  );
};

export default Navbar;
