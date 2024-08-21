import { useMemo } from "react";
import {
  DATASETKEY,
  DATASETNAME,
  DESCRIPTION,
  GENERATIONS,
  STRING,
  TABLE,
} from "../../../../constants/constants";

function useUniqueValuesHook() {
  function getUniqueValues(filterColumn, unFilteredData, query) {
    const uniqueValuesSet = new Set();
    const result = [];
    const lowercaseQuery = query.toLowerCase();

    if (!unFilteredData || !unFilteredData.columns || !unFilteredData.data) {
      console.error("Invalid unfiltered data format");
      return [];
    }

    // Check if filterColumn is valid
    if (!unFilteredData.columns.includes(filterColumn)) {
      console.error(`Invalid filter column: ${filterColumn}`);
      return [];
    }

    unFilteredData.data.forEach((singleDataItem) => {
      const fieldValue = singleDataItem[filterColumn];
      if (fieldValue !== undefined && fieldValue !== null) {
        if (filterColumn === DESCRIPTION) {
          const tableName = singleDataItem[DATASETKEY] || singleDataItem[TABLE];

          if (fieldValue.toLowerCase().includes(lowercaseQuery)) {
            result.push({
              DESCRIPTION: fieldValue,
              value: tableName || singleDataItem[DATASETNAME],
              [TABLE]: singleDataItem[TABLE] || null,
            });
          }
        } else if (filterColumn === TABLE) {
          if (fieldValue.toLowerCase().includes(lowercaseQuery)) {
            result.push({
              [TABLE]: fieldValue,
              [GENERATIONS]: singleDataItem[GENERATIONS],
              // value: singleDataItem[TABLE],
            });
          }
        } else {
          if (Array.isArray(fieldValue)) {
            fieldValue.forEach((item) => {
              if (item && item.toLowerCase().includes(lowercaseQuery)) {
                uniqueValuesSet.add(item);
              }
            });
          } else if (typeof fieldValue === STRING) {
            if (fieldValue.toLowerCase().includes(lowercaseQuery)) {
              uniqueValuesSet.add(fieldValue);
            }
          }
        }
      }
    });

    if (filterColumn !== DESCRIPTION && filterColumn !== TABLE) {
      return Array.from(uniqueValuesSet);
    }

    return result;
  }

  return useMemo(() => getUniqueValues, []);
}

export default useUniqueValuesHook;
