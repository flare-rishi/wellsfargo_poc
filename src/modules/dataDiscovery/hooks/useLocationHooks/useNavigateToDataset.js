import { useLocation } from "react-router-dom";

const useNavigateToDataset = () => {
  let location = useLocation();

  const navigateToDataset = () => {
    const parts = location.pathname.split("/");

    if (parts.length > 4) {
      if (parts[1] === "jobs" || parts[1] === "access") {
        parts[1] = "data";
      }
      const path = `/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}`;
      console.log("newPath=", path);
      return path;
    } else {
      return "/";
    }
  };

  return navigateToDataset;
};

export default useNavigateToDataset;
