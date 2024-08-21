import React from "react";
import { useSelector } from "react-redux";

import ListView from "../../common/listView/ListView";

import { checkObjectIsValid } from "../../../../../utilities/utilities";

import {
    selectSchemaError,
    selectTableSchema,
    selectTableSchemaLoading,
} from "../../../slices/tableLevelSlice/tableLevelSlice";

import "./Schema.css";
import Skeleton from "../../../../skeleton/Skeleton";
import TilesError from "../../../../../library/error/TilesError";

const Schema = () => {
    const tableSchema = useSelector(selectTableSchema);
    const schemaLoading = useSelector(selectTableSchemaLoading);
    const responseError = useSelector(selectSchemaError);
    return schemaLoading ? (
        <Skeleton />
    ) : (
        <div className="schema-main-div">
            <span className="tiles-title"> Schema</span>
            <hr></hr>
            {responseError ? (
                <TilesError msg={responseError} />
            ) : (
                checkObjectIsValid(tableSchema) && <ListView listData={tableSchema} Schema />
            )}
        </div>
    );
};

export default Schema;
