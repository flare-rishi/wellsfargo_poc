import React from "react";

import WareHouseDetailedCard from "./WareHouseDetailedCard";

import "./WareHouse.css";

const WareHouse = ({ domainData, replaceSpacesWithHyphens, tabValue }) => {
  return (
    <>
      {domainData && (
        <WareHouseDetailedCard
          key={domainData.domainName}
          domainCardDetails={domainData.domainName}
          replaceSpacesWithHyphens={replaceSpacesWithHyphens}
          tabValue={tabValue}
        />
      )}
    </>
  );
};

export default WareHouse;
