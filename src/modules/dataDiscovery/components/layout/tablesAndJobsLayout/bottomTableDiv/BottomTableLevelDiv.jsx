import React, { useEffect } from "react";

import LayoutTabs from "../../../common/layoutTabs/LayoutTabs";
import Adjustments from "../../../TableLevelView/adjustments/Adjustments";
import Explore from "../../../TableLevelView/explore/Explore";

import { ADJUSTMENTS, EXPLORE, TABLELEVELTABS, VIEWTYPETABLLE } from "../../../../../../constants/constants";

import "./BottomTableLevelDiv.css";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTab, selectTabs, updateActiveTab, updateTabs } from "../../../../../../slice/tabs/tabSlice";
import { checkObjectIsValid } from "../../../../../../utilities/utilities";

const BottomTableLevelDiv = ({ type, allowClick }) => {
    const dispatch = useDispatch();

    const tabs = useSelector(selectTabs);
    const activeTab = useSelector(selectActiveTab);

    const handleTabChangeOnTableLevel = (newValue) => {
        if (!allowClick) dispatch(updateActiveTab(newValue));
    };

    const handleTabs = () => {
        let tabsArray;
        if (type === VIEWTYPETABLLE) {
            tabsArray = TABLELEVELTABS;
        }
        dispatch(updateTabs(tabsArray));
        dispatch(updateActiveTab(tabsArray[0]));
    };
    useEffect(() => {
        if (!checkObjectIsValid(tabs) && !activeTab) handleTabs();
    }, [type]);
    return (
        <div className="bottom-table-div">
            <div className="bottom-table-tabs-div">
                <LayoutTabs tabs={tabs} activeTab={activeTab} handleOnChange={handleTabChangeOnTableLevel} />
            </div>
            <div className="bottom-table-content-div">
                <RenderBottomDivContent activeTab={activeTab} />
            </div>
        </div>
    );
};

export default BottomTableLevelDiv;

const RenderBottomDivContent = ({ activeTab }) => {
    switch (activeTab) {
        case ADJUSTMENTS:
            return <Adjustments />;
        case EXPLORE:
            return <Explore />;
        default:
            return <p> ....</p>;
    }
};
