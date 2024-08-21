import React from "react";
import { CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { FOLDER } from "../../../../assets/assets";

import "./WareHouse.css";

const WareHouseDetailedCard = ({
  domainCardDetails,
  replaceSpacesWithHyphens,
  tabValue,
}) => {
  return (
    <Link
      to={`${replaceSpacesWithHyphens(tabValue)}/${replaceSpacesWithHyphens(
        domainCardDetails
      )}`}
      className="warehouse-detailed-card"
    >
      <div>
        <CardContent>
          <CardMedia
            component="img"
            alt="folder"
            image={FOLDER}
            sx={{ width: "50px", height: "50px", margin: "5% 1%" }}
          />
          <Typography
            component="div"
            sx={{
              marginTop: "10%",
              fontFamily: "Roboto",
              fontWeight: "400",
              fontSize: "20px",
            }}
          >
            {domainCardDetails}
          </Typography>
        </CardContent>
      </div>
    </Link>
  );
};

export default WareHouseDetailedCard;
