import React, { useEffect, useState } from "react";

import ChipComponent from "../chipComponent/ChipComponent";
import { HighlightedBlueText } from "../searchBox/DisplayTabDetails";
import PiiIndicator from "../piiIndicator/PiiIndicator";

import { checkObjectIsValid } from "../../../../../utilities/utilities";
import ErrorMsg from "../../../../../library/errorsDiv/ErrorMsg";

import {
    AVATAR,
    COLUMNS,
    CONTACT,
    DAGNAME,
    DATASETKEY,
    DESCRIPTION,
    LOCATION,
    NONE,
    OWNER,
    STATUS,
    TABLE,
} from "../../../../../constants/constants";

import "./ListView.css";

const ListView = ({
    listData,
    replaceSpacesWithHyphens,
    pathName,
    overview,
    maxCount = null,
    handleUpdateUpdateCircle,
    schema,
}) => {
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    const changeOrder = (columnName, orderNumber, columns) => {
        let columnIndex = columns.indexOf(columnName);
        columns.splice(columnIndex, 1);
        columns.splice(orderNumber - 1, 0, columnName);
        return columns;
    };

    useEffect(() => {
        let tempColumns = [...listData[COLUMNS]];

        if (listData.columns.includes(DESCRIPTION)) {
            tempColumns = changeOrder(DESCRIPTION, 2, tempColumns);
        }

        setColumns(tempColumns);
        setTableData(listData.data);
    }, [listData]);

    //
    //
    //
    return (
        checkObjectIsValid(listData) && (
            <table className={`list-view ${overview || (schema && "no-border-spacing")} ${schema && "schema-table"}`}>
                <thead className="table-head">
                    <tr>
                        {columns.map((columnName) => (
                            <th key={columnName} className={`${columnName}`}>
                                {columnName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {tableData?.length === 0 ? (
                        <ErrorMsg errorMsg={"there are  no rows to display"} />
                    ) : (
                        tableData?.map((record, rowIndex) => (
                            <tr className="table-row" key={rowIndex}>
                                {columns.map((columnName) => {
                                    if (
                                        Array.isArray(record[columnName]) ||
                                        columnName === LOCATION ||
                                        columnName === OWNER ||
                                        columnName === STATUS ||
                                        columnName === CONTACT
                                    ) {
                                        let type = getChipType(columnName);
                                        return (
                                            <td className={`column ${columnName} chipdata`} key={columnName + rowIndex}>
                                                <ChipComponent
                                                    type={type}
                                                    chipData={record[columnName]}
                                                    maxCount={maxCount}
                                                />
                                            </td>
                                        );
                                    } else if (typeof record[columnName] === "boolean") {
                                        return (
                                            <td className={`column ${columnName}`} key={columnName}>
                                                <PiiIndicator
                                                    value={record[columnName]}
                                                    hideFalse={columnName.toLowerCase() === "pii" ? true : false}
                                                />
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td className={`column ${columnName}`} key={columnName}>
                                                {columnName === TABLE ||
                                                columnName === DATASETKEY ||
                                                columnName === DAGNAME ? (
                                                    <HighlightedBlueText
                                                        tabDetails={record[columnName]}
                                                        pathName={pathName}
                                                        replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                                                        location={record[LOCATION]}
                                                        columnName={columnName}
                                                        table={record[TABLE]}
                                                        handleUpdateUpdateCircle={handleUpdateUpdateCircle}
                                                    />
                                                ) : (
                                                    <span>{record[columnName]}</span>
                                                )}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        )
    );
};

const getChipType = (columnName) => {
    switch (columnName) {
        case LOCATION:
            return LOCATION;
        case CONTACT:
        case OWNER:
            return AVATAR;
        case STATUS:
            return STATUS;
        default:
            return NONE;
    }
};

export default ListView;
