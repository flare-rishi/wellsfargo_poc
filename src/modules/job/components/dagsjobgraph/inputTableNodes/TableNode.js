import { Position, Handle } from "reactflow";
import "./TableInputNode.css";
import { useState, useEffect, useRef } from "react";
import { HiOutlineDatabase } from "react-icons/hi";
import { HALLOWJOB, HALLOWLOCKACCESS } from "../../../../../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const TableNode = ({ data }) => {
    const [showRoutesDiv, setShowRoutesDiv] = useState(false);
    const nodeRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const pathName = location.pathname;

    const handleRightClickOnInputTable = (e) => {
        e.preventDefault();
        setShowRoutesDiv(true);
    };

    const handleClickOutside = (event) => {
        if (nodeRef.current && !nodeRef.current.contains(event.target)) {
            setShowRoutesDiv(false);
        }
    };

    const routeOnClick = (type, replaceRoute) => {
        const pathArray = pathName.split("/");
        let pathParts = pathArray.slice(2, -1);

        let len = pathParts.length;

        pathParts.splice(len - 1, 1, replaceRoute.label);

        let newPathName = `/${type}/${pathParts.join("/")}`;

        newPathName += `?$versionId=${replaceRoute?.versionId || "tbd"}`;
        navigate(newPathName);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="table-input-div"
            onContextMenu={handleRightClickOnInputTable}
            style={{
                padding: 10,
                border: null,
                width: "auto",
                height: "auto",
                borderRadius: 10,
            }}
        >
            <strong>{data.label}</strong>
            <Handle type="source" position={Position.Right} />
            {showRoutesDiv && (
                <div className="table-absolute-div" ref={nodeRef}>
                    <HiOutlineDatabase className="route-icon" onClick={() => routeOnClick("data", data)} />
                    <img
                        src={HALLOWJOB}
                        alt="hallow job"
                        className="logo-sidebar"
                        onClick={() => routeOnClick("jobs", data)}
                    />
                    <img
                        src={HALLOWLOCKACCESS}
                        alt="hallow acls"
                        className="logo-sidebar"
                        onClick={() => routeOnClick("access", data)}
                    />
                </div>
            )}
        </div>
    );
};

export default TableNode;
