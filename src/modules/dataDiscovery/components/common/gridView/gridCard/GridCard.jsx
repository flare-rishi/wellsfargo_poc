import React from "react";
import { Link } from "react-router-dom";

import ChipComponent from "../../chipComponent/ChipComponent";

import {
  KContact,
  KDataset,
  KDescription,
  KLastUpdated,
  KOwner,
  KLocation,
  KTags,
  KTable,
} from "../../../../utilities/utilities";

import { AVATAR, NONE, LATEST } from "../../../../../../constants/constants";

import "./GridCard.css";

const GridCard = ({ cardData, replaceSpacesWithHyphens, pathName }) => {
  const tableName = cardData[KTable] || cardData[KDataset];
  return (
    <div className="grid-card">
      <div className="card-top">
        <Link to={`${pathName}/${replaceSpacesWithHyphens(tableName)}`}>
          <p className="text-highlight-blue">{tableName} </p>
        </Link>

        <ChipComponent
          type={AVATAR}
          chipData={cardData[KOwner] || cardData[KContact]}
          maxCount={1}
        ></ChipComponent>
      </div>

      <ChipComponent
        type={KLocation}
        chipData={cardData[KLocation]}
      ></ChipComponent>
      <p className="description">{cardData[KDescription]}</p>
      {cardData[KLastUpdated] && (
        <p className="last-updated-keyword">
          Last Updated:{" "}
          <span className="last-updated-data">{cardData[KLastUpdated]}</span>
        </p>
      )}
      <div className="card-bottom">
        {cardData[KTags] && (
          <>
            <hr></hr>
            <ChipComponent
              type={NONE}
              chipData={cardData[KTags]}
              maxCount={3}
            ></ChipComponent>
          </>
        )}
      </div>
    </div>
  );
};

export default GridCard;

//  <Link
//    to={`${pathName}/${replaceSpacesWithHyphens(tableName)}${
//      cardData[KTable] ? `?versionId=${LATEST}` : ""
//    }`}
//  >
//    <p className="text-highlight-blue">{tableName} </p>
//  </Link>;
