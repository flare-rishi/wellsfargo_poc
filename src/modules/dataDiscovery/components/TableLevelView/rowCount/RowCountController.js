import React, { useRef } from "react";
import { useSelector } from "react-redux";

import RowCount from "./RowCount";

import useGetSearchParams from "../../../hooks/useLocationHooks/useGetSearchParams";

import {
    selectNextDates,
    selectPreviousDates,
    selectRecordsCountData,
    selectRecordsCountLoading,
    selectRecordsError,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import Skeleton from "../../../../skeleton/Skeleton";

const RowCountController = () => {
    const intervalRefs = useRef([]);

    let { forkId } = useGetSearchParams();

    const recordsCountData = useSelector(selectRecordsCountData);
    const previousDates = useSelector(selectPreviousDates);
    const nextDates = useSelector(selectNextDates);
    const errors = useSelector(selectRecordsError);
    const loading = useSelector(selectRecordsCountLoading);

    return loading ? (
        <Skeleton />
    ) : (
        <RowCount
            recordsCountData={recordsCountData}
            nextDates={nextDates}
            previousDates={previousDates}
            forkId={forkId}
            intervalRefs={intervalRefs}
            errors={errors}
        />
    );
};

export default RowCountController;
