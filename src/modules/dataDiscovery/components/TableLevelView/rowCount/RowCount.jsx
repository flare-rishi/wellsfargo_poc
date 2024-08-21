import { useState, useEffect } from "react";
import "./rowCount.css";
import { CURRENTCOUNT, NA, NEXTDIFF, PREVIOUSDIFF } from "../../../../../constants/constants";
import { checkObjectIsValid } from "../../../../../utilities/utilities";

const RowCount = ({ recordsCountData, nextDates, previousDates, intervalRefs, forkId, errors }) => {
    const [displayedCurrentCount, setDisplayedCurrentCount] = useState(NA);
    const [displayedPreviousDiff, setDisplayedPreviousDiff] = useState(NA);
    const [displayedNextDiff, setDisplayedNextDiff] = useState(NA);

    useEffect(() => {
        const animateCount = (start, end, setFunc, duration) => {
            intervalRefs.current = [];

            const increment = (end - start) / (duration / 10);
            let current = start;

            // Clean the any current intervals
            const interval = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    current = end;
                    clearInterval(interval);
                }
                setFunc(Math.floor(current));
            }, 10);

            intervalRefs.current.push(interval);
        };

        if (forkId) {
            setDisplayedCurrentCount(recordsCountData?.[CURRENTCOUNT]);
        } else {
            if (checkObjectIsValid(recordsCountData) && recordsCountData[CURRENTCOUNT]) {
                animateCount(0, recordsCountData[CURRENTCOUNT], setDisplayedCurrentCount, 500);

                if (recordsCountData[PREVIOUSDIFF] !== NA) {
                    animateCount(0, recordsCountData[PREVIOUSDIFF], setDisplayedPreviousDiff, 500);
                } else {
                    setDisplayedPreviousDiff(NA);
                }

                if (recordsCountData[NEXTDIFF] != NA) {
                    animateCount(0, recordsCountData[NEXTDIFF], setDisplayedNextDiff, 500);
                } else {
                    setDisplayedNextDiff(NA);
                }
            }
        }
    }, [recordsCountData]);

    return (
        checkObjectIsValid(recordsCountData) && (
            <div className="row-count-tile-box">
                <div className="row-count-container">
                    {errors?.currentError ? (
                        <p>{errors?.currentError || ""}</p>
                    ) : (
                        <span className="current-row-count">{displayedCurrentCount}</span>
                    )}
                </div>
                {!forkId && (
                    <div className="rows-compare-container">
                        <div className="previous-row-container">
                            {errors?.previousError ? (
                                <p> {errors?.previousError || ""}</p>
                            ) : (
                                <>
                                    <span className="row-compare-header">{previousDates}</span>
                                    <span
                                        className={
                                            displayedPreviousDiff < 0
                                                ? "negative row-compare-count"
                                                : "positive row-compare-count"
                                        }
                                    >
                                        {displayedPreviousDiff >= 0 && "+"}+0
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="vertical-line"></div>
                        <div className="next-row-conatainer">
                            {errors?.nextError ? (
                                <p>{errors.nextError}</p>
                            ) : (
                                <>
                                    <span className="row-compare-header">{nextDates}</span>
                                    <span
                                        className={
                                            displayedNextDiff < 0
                                                ? "negative row-compare-count"
                                                : "positive row-compare-count"
                                        }
                                    >
                                        {displayedNextDiff >= 0 && "+"}+0
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default RowCount;
