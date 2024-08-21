import React from "react";

import QualityMetrics from "../../TableLevelView/qualityMetrics/QualityMetrics";
import Tags from "../../TableLevelView/Tags/Tags";
import Description from "../../TableLevelView/description/Description";
import RowCountController from "../../TableLevelView/rowCount/RowCountController";

import { DESCRIPTION, QUALITYMETRICS, RECORD, TAGS } from "../../../../../constants/constants";

import "./Tiles.css";
import ErrorMsg from "../../../../../library/errorsDiv/ErrorMsg";

const Tiles = ({ tileType, warningMessage }) => {
    return warningMessage ? (
        <ErrorMsg errorMsg={warningMessage} />
    ) : (
        <div
            className={`div-background-border ${
                tileType == QUALITYMETRICS ? "quality-metrics-tile" : tileType == RECORD ? `record-tile` : "tiles-main"
            }`}
        >
            <div className="tile-box">
                <div className="tile-header-container">
                    <span className="tiles-title">{tileType}</span>
                    <hr className="title-seperator"></hr>
                </div>
                <div className="tiles-content-container">
                    <GetTilesData tileType={tileType} />
                </div>
            </div>
        </div>
    );
};

export default Tiles;

function GetTilesData({ tileType }) {
    switch (tileType) {
        case RECORD:
            return <RowCountController />;
        case QUALITYMETRICS:
            return <QualityMetrics />;
        case DESCRIPTION:
            return <Description />;
        case TAGS:
            return <Tags />;
        default:
            return <span>data</span>;
    }
}
