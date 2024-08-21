import React, { useEffect, useState } from "react";
import { Chip, Tooltip } from "@mui/material";
import { Avatar } from "@mui/material";

import { Amazon, Azure, Gcp, hdfs, prem } from "../../../../../assets/assets";

import {
  AVATAR,
  ERROR,
  LOCATION,
  OUTLINED,
  SMALL,
  STATUS,
  SUCCESS,
} from "../../../../../constants/constants";

import "./ChipComponent.css";

const ChipComponent = ({ type, chipData, maxCount = null }) => {
  const [HiddenChips, setHiddenChips] = useState(null);

  useEffect(() => {
    if (maxCount != null && Array.isArray(chipData)) {
      if (chipData.length > maxCount)
        setHiddenChips(chipData.length - maxCount);
    }
  }, []);

  return (
    <div className="data-discovery-chip-stack">
      {Array.isArray(chipData) ? (
        chipData
          .slice(0, getMaxCount(maxCount, chipData.length))
          .map((item, index) => {
            if (type === LOCATION) {
              return (
                <div className="images" key={index}>
                  <img src={getImageSrc(item)} alt={`${item} LOGO`} />
                </div>
              );
            } else {
              return (
                <Chip
                  label={`${item}`}
                  avatar={
                    type === AVATAR ? <Avatar alt={`${item}`} src="jk" /> : null
                  }
                  size={SMALL}
                  variant={OUTLINED}
                />
              );
            }
          })
      ) : (
        // Else part: handling the case where `chipData` is not an array
        <div>
          {type === LOCATION ? (
            <div className="images">
              <img src={getImageSrc(chipData)} alt={`${chipData} LOGO`} />
            </div>
          ) : type === STATUS ? (
            <Chip
              label={chipData}
              color={`${chipData === SUCCESS ? SUCCESS : ERROR}`}
              variant={OUTLINED}
              size={SMALL}
            ></Chip>
          ) : (
            <Chip
              label={`${chipData}`}
              avatar={
                type === AVATAR ? <Avatar alt={`${chipData}`} src="jk" /> : null
              }
              size={SMALL}
              variant={OUTLINED}
            />
          )}
        </div>
      )}
      {maxCount != null && HiddenChips != null ? (
        <Tooltip title="more owners">
          <Chip label={`+${HiddenChips}`} size={SMALL} variant={OUTLINED} />
        </Tooltip>
      ) : (
        <></>
      )}
    </div>
  );
};

export const getImageSrc = (item) => {
  switch (item) {
    case "Amazon":
    case "amazon":
    case "aws":
    case "Aws":
      return Amazon;
    case "Azure":
    case "azure":
      return Azure;
    case "Gcp":
    case "gcp":
      return Gcp;
    case "hdfs":
    case "HDFS":
      return hdfs;
    case "Local":
      return prem;
    default:
      return null;
  }
};

const getMaxCount = (maxCount, chipDataLength) => {
  if (maxCount != null) {
    return maxCount;
  } else {
    return chipDataLength;
  }
};
export default ChipComponent;
