import React, { useEffect, useState } from "react";
import "./Adjustments.css";

import ListView from "../../common/listView/ListView";
import { useSelector } from "react-redux";
import {
  selectTableAdjustmentError,
  selectTableAdjustments,
  selectTableAdjustmentsLoading,
} from "../../../slices/tableLevelSlice/tableLevelSlice";
import { checkObjectIsValid } from "../../../../../utilities/utilities";
import TilesError from "../../../../../library/error/TilesError";
import Skeleton from "../../../../skeleton/Skeleton";

const Adjustments = () => {
  const tableAdjustments = useSelector(selectTableAdjustments);
  const loading = useSelector(selectTableAdjustmentsLoading);
  const responseError = useSelector(selectTableAdjustmentError);

  return loading ? (
    <Skeleton />
  ) : responseError ? (
    <TilesError msg={responseError} />
  ) : (
    checkObjectIsValid(tableAdjustments) && (
      <div className="adjustments-main-div">
        <div className="adjustments-table-div">
          {Object.keys(tableAdjustments)?.length > 0 && (
            <ListView listData={tableAdjustments} />
          )}
        </div>
      </div>
    )
  );
};

export default Adjustments;
