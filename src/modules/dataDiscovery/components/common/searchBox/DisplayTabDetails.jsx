import { Link } from "react-router-dom";
import { LATEST } from "../../../../../constants/constants";

import ChipComponent from "../chipComponent/ChipComponent";

import {
    AVATAR,
    CONTACT,
    DATASETKEY,
    DESCRIPTION,
    LOCATION,
    OWNER,
    STRING,
    TABLE,
    TAGS,
} from "../../../../../constants/constants";
import useGetSearchParams from "../../../hooks/useLocationHooks/useGetSearchParams";

const DisplayTabDetails = ({ tabDetails, activeFilterTab, pathName, replaceSpacesWithHyphens }) => {
    switch (activeFilterTab) {
        case TAGS:
            return typeof tabDetails === STRING && <p className="search-dropdown-tab">{tabDetails}</p>;
        case OWNER:
        case CONTACT:
            return <ChipComponent type={AVATAR} chipData={tabDetails} />;
        case TABLE:
            return (
                <HighlightedBlueText
                    tabDetails={tabDetails?.[TABLE]}
                    pathName={pathName}
                    replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                    table
                />
            );
        case DATASETKEY:
            return (
                <HighlightedBlueText
                    tabDetails={tabDetails}
                    pathName={pathName}
                    replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                />
            );
        case DESCRIPTION:
            return (
                <div className="search-description-div-main">
                    {tabDetails.value && (
                        <HighlightedBlueText
                            tabDetails={tabDetails.value}
                            pathName={pathName}
                            replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                            table={tabDetails?.[TABLE]}
                        />
                    )}
                    <p className="search-description-div"> {tabDetails.DESCRIPTION}</p>
                </div>
            );
        case LOCATION:
            return <ChipComponent type={LOCATION} chipData={tabDetails} />;
    }
};

export default DisplayTabDetails;

// component is for the  displaying the blue text

export const HighlightedBlueText = ({ tabDetails, pathName, replaceSpacesWithHyphens, table }) => {
    let { searchParams } = useGetSearchParams();
    return (
        <div className="display-location-para">
            {typeof tabDetails === STRING && (
                <div>
                    <Link
                        to={`${pathName}/${replaceSpacesWithHyphens(tabDetails)}${
                            searchParams ? `?${searchParams}` : ""
                        }`}
                    >
                        <p className="text-highlight-blue">{tabDetails}</p>
                    </Link>
                </div>
            )}
        </div>
    );
};

// <Link
//   to={`${pathName}/${replaceSpacesWithHyphens(tabDetails)}${
//     table ? `?versionId=${LATEST}` : ""
//   }`}
// >
//   <p className="text-highlight-blue">{tabDetails}</p>
// </Link>;
