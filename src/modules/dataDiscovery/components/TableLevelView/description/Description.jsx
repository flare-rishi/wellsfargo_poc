import { useSelector } from "react-redux";

import Skeleton from "../../../../skeleton/Skeleton";
import ErrorMsg from "../../../../../library/errorsDiv/ErrorMsg";

import {
    selectTableMetaData,
    selectTableMetaDataError,
    selectTableMetaDataLoading,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import { checkObjectIsValid } from "../../../../../utilities/utilities";

import "./description.css";
import TilesError from "../../../../../library/error/TilesError";
import { NO_DATA } from "../../../../../constants/constants";

const Description = () => {
    const tableMetaData = useSelector(selectTableMetaData);
    const loading = useSelector(selectTableMetaDataLoading);
    const responseError = useSelector(selectTableMetaDataError);

    return loading ? (
        <Skeleton />
    ) : responseError ? (
        <TilesError msg={responseError} />
    ) : checkObjectIsValid(tableMetaData) ? (
        <div className="description-tags-box">
            <div className="description-box">
                <p className="paragraph">
                    {tableMetaData?.Description || tableMetaData.Description || "no description"}
                </p>
            </div>
            <div className="tags-box">
                <span>Tags:</span>
                <div>
                    {tableMetaData?.Tags.map((tag, index) => {
                        return (
                            <span key={index}>
                                {tag}
                                {index !== tableMetaData?.Tags.length - 1 && ","}{" "}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    ) : (
        <ErrorMsg errorMsg={NO_DATA} />
    );
};

export default Description;
