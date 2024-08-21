import React from "react";
// import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
import "./ProtectedRoutes.css";
import SideBar from "../../../sideBar/components/SideBar";

const ProtectedRoutes = () => {
  return (
    <div className="layout">
      <SideBar />
      <main className="layout-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoutes;

// import React from "react";
// // import { useSelector } from "react-redux";
// // import { selectLoggedInUser } from "../authSlice";
// import { Navigate } from "react-router-dom";

// const ProtectedRoutes = ({ children }) => {
//   // const user = useSelector(selectLoggedInUser);
//   let user = true;
//   if (!user) {
//     return <Navigate to="/" replace={true} />;
//   }
//   return children;
// };

// export default ProtectedRoutes;
