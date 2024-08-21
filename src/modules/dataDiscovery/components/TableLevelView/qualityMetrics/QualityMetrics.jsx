import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import Skeleton from "../../../../skeleton/Skeleton";
import Chart from "react-apexcharts";

import {
    selectQualityMetricsData,
    selectQualityMetricsError,
    selectQualityMetricsLoading,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import { checkObjectIsValid } from "../../../../../utilities/utilities";

import {
    ACCEPTABLETHRESHOLD,
    GREEN_QM,
    NOTACCEPTABLETHRESHOLD,
    RED_QM,
    YELLOW_QM,
} from "../../../../../constants/constants";

import "./barchart.css";
import "./CircularPercentageChart.css";
import TilesError from "../../../../../library/error/TilesError";

const QualityMetrics = () => {
    const metrics = useSelector(selectQualityMetricsData);
    const loading = useSelector(selectQualityMetricsLoading);
    const responseError = useSelector(selectQualityMetricsError);

    const graphBoxRef = useRef(null);

    return loading ? (
        <Skeleton />
    ) : responseError ? (
        <TilesError msg={responseError} />
    ) : (
        checkObjectIsValid(metrics) && (
            <div className="quality-metrics-box">
                <div className="quality-metrics-box-circular-graph-box">
                    {metrics.map((metric, index) => {
                        return (
                            <PieDoughnut
                                key={index}
                                values={metric.values}
                                label={metric.title}
                                diff={metric.diff}
                                graphBoxRef={graphBoxRef}
                            ></PieDoughnut>
                        );
                    })}
                </div>
            </div>
        )
    );
};

export default QualityMetrics;

//component to render the pieDoughnut

const PieDoughnut = ({ values, label, diff }) => {
    const [percentage, setPercentage] = useState(null);
    const [acceptable, setAcceptable] = useState(0);
    const [notAcceptable, setNotAcceptable] = useState(0);
    const [good, setGood] = useState(0);
    const [options, setOptions] = useState({});
    const series = [notAcceptable, acceptable, good];
    const barBoxRef = useRef(null);

    const [width, setWidth] = useState(null);
    //color values used to represent acceptable, non-acceptable, good

    useEffect(() => {
        let length = values.length;
        let sum = 0;
        let notAcceptableCount = 0;
        let acceptableCount = 0;
        let goodCount = 0;

        for (let i = 0; i < length; i++) {
            sum += values[i];

            if (values[i] < NOTACCEPTABLETHRESHOLD) {
                notAcceptableCount++;
            } else if (values[i] < ACCEPTABLETHRESHOLD) {
                acceptableCount++;
            } else {
                goodCount++;
            }
        }

        setNotAcceptable(notAcceptableCount);
        setAcceptable(acceptableCount);
        setGood(goodCount);

        let tempPercentage = (sum / (length * 100)) * 100;
        const formattedPercentage = Number.isInteger(tempPercentage)
            ? tempPercentage.toString()
            : parseFloat(tempPercentage.toFixed(2));

        const tempOptions = {
            chart: {
                type: "donut",
                animations: {
                    enabled: true, // Disable animations for smoother rendering in small size
                },

                // parentHeightOffset: "0",
                sparkline: {
                    enabled: true,
                },
            },

            labels: [],

            dataLabels: {
                enabled: false, // Disable data labels
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: false, // Hide all labels inside the donut
                        },
                    },
                },
            },
            tooltip: {
                enabled: true,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    const categories = ["Not Acceptable", "Acceptable", "Good"];
                    const colors = [RED_QM, YELLOW_QM, GREEN_QM];
                    return `<div class="custom-tooltip" style="z-index:100;" >
          <div class="tooltip-series" style="display: flex; align-items: center;">
          <span class="tooltip-marker" style="background-color: ${colors[seriesIndex]}; width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
          <span>${categories[seriesIndex]}: ${series[seriesIndex]} rules</span>
          </div>
          </div>`;
                },
            },
            legend: {
                show: false, // Hide legend
            },
            stroke: {
                show: true, // Hide the stroke to make the chart cleaner
            },
            colors: [RED_QM, YELLOW_QM, GREEN_QM],
            // Customize colors
            plotOptions: {
                pie: {
                    donut: {},
                },
            },
        };

        setOptions(tempOptions);
        setPercentage(formattedPercentage);
    }, [values]);

    //
    //
    //
    //This code is for alligning the height of bar-box same as its width
    //didn't found a way so I had to do that wasn't possible with css
    useEffect(() => {
        const handleResize = () => {
            if (barBoxRef.current) {
                // const width = barBoxRef.current.offsetWidth;
                const tileContentBox = document.querySelector(".quality-metrics-box");
                let width;

                if (tileContentBox.offsetHeight < tileContentBox.offsetWidth / 6) {
                    width = tileContentBox.offsetHeight * 0.6;
                } else {
                    width = tileContentBox.offsetWidth / 7;
                }
                barBoxRef.current.style.width = `${width}px`;
                setWidth(width);
                // barBoxRef.current.style.height = `${width}px`;
            }
        };

        handleResize(); // Set initial height
        window.addEventListener("resize", handleResize); // Update height on resize
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [percentage]);

    //
    //
    //

    useEffect(() => {
        const handleResize = () => {
            if (barBoxRef.current) {
                const width = barBoxRef.current.offsetWidth;
                barBoxRef.current.style.height = `${width}px`;
            }
        };

        handleResize(); // Set initial height
        window.addEventListener("resize", handleResize); // Update height on resize
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [width]);

    return (
        <>
            {percentage !== null && (
                <div className="circular-progress-bar">
                    <span>{label}</span>
                    <div className="bar-box" ref={barBoxRef}>
                        <div>
                            <span>{percentage}%</span>
                            {width && (
                                <Chart options={options} series={series} type="donut" height="100%" width={width} />
                            )}
                        </div>
                    </div>
                    <span className={`quality-metrics-comparator ${diff < 0 ? "negative-diff" : "positive-diff"}`}>
                        {diff}
                    </span>
                </div>
            )}
        </>
    );
};
