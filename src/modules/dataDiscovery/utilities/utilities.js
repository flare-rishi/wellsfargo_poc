import { version } from "react";
import {
    ACLS_DATA_JSON,
    ACLS_RESPONSE,
    CURRENTCOUNT,
    DATA,
    ERROR400,
    EXPLORE_RESPONSE,
    LASTFETCHED,
    LATEST_VERSION,
    MAX_ENTRIES,
    NA,
    NEXTDIFF,
    PREVIOUSDIFF,
    RESPONSE,
    RESPONSEMESSAGE,
    RESPONSESTATUS,
    ROWS,
    SCHEMA_RESPONSE,
    STATUS,
    TABLE_PATH_RESPONSE,
    TABLENOTFOUND,
    TIME_LIMIT,
    VERSIONNOTFOUND,
} from "../../../constants/constants";

const KOwner = "Owner";
const KContact = "Contact";
const KLastUpdated = "Last Updated";
const KLocation = "Location";
const KDescription = "Description";
const KTable = "Table";
const KDataset = "Dataset";
const KTags = "Tags";

export { KContact, KDataset, KDescription, KLastUpdated, KOwner, KLocation, KTags, KTable };

export function sortBasedDateAndConvertsJson(tableVersionData) {
    // Sort versions based on date and time
    const sortedVersions = tableVersionData.versions.sort((a, b) => new Date(a.Updated) - new Date(b.Updated));
    let versions = {};

    // Traverse through the sortedVersions and create a key-value pair for each version
    sortedVersions.forEach((version) => {
        versions[version.Generation] = {
            Size: version.Size,
            Updated: version.Updated,
        };
    });

    // Check whether a fork is present for the version and append it to that version object
    Object.keys(tableVersionData.forks).forEach((generation) => {
        const forks = tableVersionData.forks[generation];
        if (versions[generation]) {
            versions[generation].forks = forks.map((forkId) => {
                return { [forkId]: { Generation: generation, Fork: forkId } };
            });
        }
    });

    let latestVersion = calculateLatestVersion(versions);
    return { versions, latestVersion };
}

//  function to construct URL with optional query parameters
export const constructTableMetaDataUrl = (endPoint, domainName, dataSetName, tableName, versionId, forkId) => {
    let url = `/${endPoint}/${domainName}/${dataSetName}/${tableName}/${versionId}`;

    if (forkId) {
        url += `?forkId=${forkId}`;
    }

    return url;
};

// calculates the latest version and returns

export const calculateLatestVersion = (versions) => {
    let versionArray = Object.keys(versions);
    let versionsLength = versionArray.length;
    let selectedVersion = versionArray[versionsLength - 1];
    return selectedVersion;
};

// handles the error cases whether the version is deleted or an internal server or the entire table got deleted

export function handleCommonError(error, dispatch, updateVersionNotFound, updateTableNotFound) {
    let errorMsg;
    let isVersionNotFound = false;
    let isTableNotFound = false;

    if (error[RESPONSE][RESPONSESTATUS] === ERROR400 && error[RESPONSE][DATA] === VERSIONNOTFOUND) {
        isVersionNotFound = true;
    }
    if (isVersionNotFound) {
        dispatch(updateVersionNotFound(isVersionNotFound));
    }

    if (error[RESPONSE][RESPONSESTATUS] === ERROR400 && error[RESPONSE][DATA] === TABLENOTFOUND) {
        isTableNotFound = true;
    }

    if (isTableNotFound) {
        dispatch(updateTableNotFound(isTableNotFound));
    }

    errorMsg = error[RESPONSE][DATA];

    return errorMsg;
}

export function checkIsLatestVersionSame(latestVersion, responseLatestVersion) {
    return latestVersion !== responseLatestVersion;
}

// this handles the response of the records api (handles all the success and error cases)

export const handleApiResponse = (
    response,
    newObj,
    key,
    dispatch,
    errors,
    errorKey,
    latestVersion,
    updateVersionNotFound,
    updateDidLatestVersionChanged,
    updateTableNotFound,
    currentCount
) => {
    try {
        if (response.error) {
            newObj[key] = NA;
            const errorMsg = handleCommonError(response.error, dispatch, updateVersionNotFound, updateTableNotFound);
            errors[errorKey] = errorMsg;
        } else if (response.data[ROWS] === -1) {
            newObj[key] = NA;
        } else {
            switch (key) {
                case CURRENTCOUNT:
                    newObj[key] = response.data[ROWS];
                    break;
                case PREVIOUSDIFF:
                    newObj[key] = response.data[ROWS] - currentCount;

                    break;
                case NEXTDIFF:
                    newObj[key] = response.data[ROWS] - currentCount;
                    break;
            }

            if (checkIsLatestVersionSame(latestVersion, response.data[LATEST_VERSION])) {
                dispatch(updateDidLatestVersionChanged(true));
            }
        }
    } catch (error) {
        console.error("156 handle  error", error);
    }
};

// check the cached time is less than  2 mins

export function checkInTimePeriod(lastFetched) {
    const lastFetchedTime = new Date(lastFetched);
    const currentTime = new Date();
    const timeDifference = (currentTime - lastFetchedTime) / 1000;
    return timeDifference < 3600000;
}

// checks in cache whether we already have the data in cache

export function checkCache(searchObj, versionId) {
    let searchObjKeys = Object.keys(searchObj);

    if (searchObjKeys.includes(versionId)) {
        const lastFetched = searchObj[versionId][LASTFETCHED];
        if (lastFetched) {
            return checkInTimePeriod(lastFetched);
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// handles the success of the api and checks whether the latest version is same or different

export function handleSuccessResponse(
    dispatch,
    latestVersion,
    updateDidLatestVersionChanged,
    queryString,
    response,
    presentState,
    responseKey
) {
    try {
        let returnResponse = {};
        if (responseKey !== EXPLORE_RESPONSE && responseKey !== TABLE_PATH_RESPONSE) {
            if (checkIsLatestVersionSame(latestVersion, response[LATEST_VERSION]) && responseKey !== ACLS_RESPONSE) {
                dispatch(updateDidLatestVersionChanged(true));
            }
        }

        const newEntry = {
            [LASTFETCHED]: new Date().toISOString(),
            data: response,
        };

        if (responseKey === SCHEMA_RESPONSE && (queryString.includes("null") || queryString.includes("undefined"))) {
            console.log(" 215 response ", response);

            if (queryString.includes("null")) {
                queryString = queryString.replace("null", response?.selected_group || "lucky");
            } else if (queryString.includes("undefined")) {
                queryString = queryString.replace("undefined", response?.selected_group || "lucky");
            }
        }

        returnResponse = manageCache(presentState, queryString, newEntry);

        return returnResponse;
    } catch (error) {
        console.error("214", error);
    }
}

//  it will set cache in the redux state

export const handleRecordsCache = (newObj, previousDates, nextDates, errors, presentState, queryString) => {
    let returnResponse = {};
    const newEntry = {
        [LASTFETCHED]: new Date().toISOString(),
        data: {
            newObj,
            previousDates,
            nextDates,
            errors,
        },
    };
    returnResponse = manageCache(presentState, queryString, newEntry);
    return returnResponse;
};

const manageCache = (state, key, newEntry) => {
    const currentTime = new Date().getTime();

    // Filter out entries older than TIME_LIMIT
    let filteredEntries = Object.entries(state).filter(([_, value]) => {
        return currentTime - new Date(value[LASTFETCHED]).getTime() <= TIME_LIMIT;
    });

    // Create an object from the filtered entries
    let filteredState = Object.fromEntries(filteredEntries);

    // If the number of entries is at the maximum limit, remove the oldest entry
    if (filteredEntries.length >= MAX_ENTRIES) {
        filteredEntries.sort((a, b) => new Date(a[1][LASTFETCHED]) - new Date(b[1][LASTFETCHED]));
        const oldestEntryKey = filteredEntries.shift()[0];
        delete filteredState[oldestEntryKey];
    }

    // Add the new entry
    filteredState[key] = newEntry;

    return filteredState;
};
