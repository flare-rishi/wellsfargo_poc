import React from "react";
import "./SideBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FILLEDLOCKACCESS, FILLEDJOB, HALLOWLOCKACCESS, HALLOWJOB } from "../../../assets/assets";
import { HiOutlineDatabase, HiDatabase } from "react-icons/hi";
import { useSelector } from "react-redux";
import { selectAllowCLick } from "../../dataDiscovery/slices/tableLevelSlice/tableLevelSlice";

const routes = [
    {
        path: "/data",
        label: "Data",
    },
    {
        path: "/jobs",
        label: "Jobs",
    },
    {
        path: "/access",
        label: "Access",
    },
];

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dataPathPattern = /^\/data\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/;
    const aclsPathPattern = /^\/access\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/;
    const jobsPathPattern = /^\/jobs\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/;
    const jobsGraphPathPattern = /^\/jobs\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/;

    const excludeRoutes = ["Access", "Jobs"];
    const pathName = location.pathname;

    const allowClick = useSelector(selectAllowCLick);

    const calculateTheRoute = (route) => {
        const queryString = location.search;
        const pathArray = pathName.split("/");

        let newPathName = route.path;

        if (route.path === "/data" && jobsGraphPathPattern.test(pathName)) {
            // Extract dynamic parts from the current path, skipping the last segment
            const pathParts = pathArray.slice(2, -1); // Skip the first "/jobs" segment and the last segment

            // Construct new path by joining the remaining parts
            newPathName = `/data/${pathParts.join("/")}`;
        } else {
            // Handle other cases
            newPathName = [...pathArray];
            newPathName.splice(1, 1, route.path.split("/")[1]);
            newPathName = newPathName.join("/");
        }

        // Construct final path with query string if present
        let finalPath = newPathName;
        if (queryString) {
            finalPath += queryString;
        }

        navigate(finalPath);
    };

    const getIcon = (route) => {
        const isActive = location.pathname.includes(route.path);
        switch (route.path) {
            case "/data":
                return isActive ? <HiDatabase className="route-icon" /> : <HiOutlineDatabase className="route-icon" />;
            case "/jobs":
                if (
                    dataPathPattern.test(location.pathname) ||
                    jobsPathPattern.test(location.pathname) ||
                    jobsGraphPathPattern.test(location.pathname) ||
                    aclsPathPattern.test(location.pathname)
                ) {
                    return isActive ? (
                        <img src={FILLEDJOB} alt="filled job" className="logo-sidebar" />
                    ) : (
                        <img src={HALLOWJOB} alt="hallow job" className="logo-sidebar" />
                    );
                }
            case "/access":
                if (
                    dataPathPattern.test(location.pathname) ||
                    jobsPathPattern.test(location.pathname) ||
                    aclsPathPattern.test(location.pathname)
                ) {
                    return isActive ? (
                        <img src={FILLEDLOCKACCESS} alt="filled acls" className="logo-sidebar" />
                    ) : (
                        <img src={HALLOWLOCKACCESS} alt="hallow acls" className="logo-sidebar" />
                    );
                }
                return null;
            default:
                return null;
        }
    };
    const showRouteLabel = (route) => {
        const isJobGraphPath = jobsGraphPathPattern.test(location.pathname);
        return (
            !(route.label === "Access" && isJobGraphPath) &&
            (!excludeRoutes.includes(route.label) ||
                dataPathPattern.test(location.pathname) ||
                jobsPathPattern.test(location.pathname) ||
                jobsGraphPathPattern.test(location.pathname) ||
                aclsPathPattern.test(location.pathname))
        );
    };

    return (
        <div className="sideBar-main">
            <Link to="/">
                <svg
                    width="31"
                    height="30"
                    viewBox="0 0 31 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="dataFlare-logo"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M26.9963 1.5C26.1325 1.5 25.3782 2.24018 25.3782 3.22131C25.3782 4.20243 26.1325 4.94261 26.9963 4.94261C27.8601 4.94261 28.6144 4.20243 28.6144 3.22131C28.6144 2.24018 27.8601 1.5 26.9963 1.5ZM23.9311 2.62965C24.1981 1.15286 25.4462 0 26.9963 0C28.7482 0 30.1144 1.47271 30.1144 3.22131C30.1144 4.96991 28.7482 6.44261 26.9963 6.44261C25.5589 6.44261 24.3813 5.45131 24.0047 4.12965L15.7615 4.12965V14.8484L23.9312 14.8484C24.1984 13.3718 25.4464 12.2192 26.9963 12.2192C28.7482 12.2192 30.1144 13.6919 30.1144 15.4405C30.1144 17.1891 28.7482 18.6618 26.9963 18.6618C25.5588 18.6618 24.381 17.6703 24.0045 16.3484L15.7615 16.3484V28.4778V28.9468V29.9778H8.86917e-05V29.4169H0V14.8484H0.000207901V14.5895H5.04405C5.40254 13.2393 6.5934 12.2192 8.05144 12.2192C9.80335 12.2192 11.1695 13.6919 11.1695 15.4405C11.1695 17.1891 9.80335 18.6618 8.05144 18.6618C6.52152 18.6618 5.28577 17.5387 4.99716 16.0895H1.5L1.5 28.4778H14.2615L14.2615 2.62939H15.7615V2.62965L23.9311 2.62965ZM8.05144 13.7192C7.45488 13.7192 6.91057 14.0722 6.63086 14.6139V16.0895H6.55135C6.79619 16.7303 7.39189 17.1618 8.05144 17.1618C8.91525 17.1618 9.66953 16.4217 9.66953 15.4405C9.66953 14.4594 8.91525 13.7192 8.05144 13.7192ZM25.3782 15.4405C25.3782 14.4594 26.1325 13.7192 26.9963 13.7192C27.8601 13.7192 28.6144 14.4594 28.6144 15.4405C28.6144 16.4217 27.8601 17.1618 26.9963 17.1618C26.1325 17.1618 25.3782 16.4217 25.3782 15.4405Z"
                        fill="url(#paint0_linear_457_4551)"
                    />
                    <defs>
                        <linearGradient
                            id="paint0_linear_457_4551"
                            x1="-4.16054"
                            y1="29.9779"
                            x2="36.8505"
                            y2="29.9779"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#E4A730" />
                            <stop offset="0.575" stopColor="#E46230" />
                            <stop offset="1" stopColor="#E43030" />
                        </linearGradient>
                    </defs>
                </svg>
            </Link>
            {routes.map(
                (route) =>
                    showRouteLabel(route) && (
                        <div
                            key={route.path}
                            onClick={() => !allowClick && calculateTheRoute(route)}
                            className={`routes-link ${location.pathname.includes(route.path) && "route-link-active"} ${
                                allowClick ? "wait" : "pointer"
                            }`}
                        >
                            {getIcon(route)}

                            <p className="logo-route">{route.label}</p>
                        </div>
                    )
            )}
        </div>
    );
};

export default SideBar;
