import { useDispatch } from "react-redux";

import { updateFilteredData } from "../../slices/domainSlice/domainSlice";
import { updateFilteredTableData } from "../../slices/dataSetsSlice/dataSetsSlice";

import { DATASET, DOMAIN, STRING } from "../../../../constants/constants";

function useSearchHook() {
  const dispatch = useDispatch();

  function useSearch(filterColumn, unFilteredData, query, type) {
    let filteredData = { columns: unFilteredData.columns, data: [] };

    // Check if filterColumn is valid
    if (!unFilteredData.columns.includes(filterColumn)) {
      console.error(`Invalid filter column: ${filterColumn}`);
      return filteredData;
    }

    const lowercaseQuery = query.toLowerCase();

    filteredData.data = unFilteredData.data.filter((singleDataItem) => {
      const fieldValue = singleDataItem[filterColumn];
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((item) =>
          item.toLowerCase().includes(lowercaseQuery)
        );
      } else if (typeof fieldValue === STRING) {
        return fieldValue.toLowerCase().includes(lowercaseQuery);
      }
      return false;
    });

    if (type === DOMAIN) {
      dispatch(updateFilteredData(filteredData));
    } else if (type === DATASET) {
      dispatch(updateFilteredTableData(filteredData));
    }

    return filteredData;
  }

  return useSearch;
}

export default useSearchHook;
