import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LayoutTabs from "../common/layoutTabs/LayoutTabs";
import Skeleton from "../../../skeleton/Skeleton";
import WareHouse from "./WareHouse";

import { checkObjectIsValid, replaceSpacesWithHyphens } from "../../../../utilities/utilities";

import { fetchWareHouseAsync } from "../../slices/wareHouseSlice/wareHouseThunk";

import {
    selectDomains,
    selectSelectedWareHouse,
    selectWareHouseLoading,
    updateSelectedWareHouse,
} from "../../slices/wareHouseSlice/wareHouseSlice";
import { resetUserGroupDropDown } from "../../../../slice/userSlices/userSlice";

const WareHouseController = () => {
    const dispatch = useDispatch();

    const wareHouseData = useSelector(selectDomains);
    const wareHouseLoading = useSelector(selectWareHouseLoading);
    const tabValue = useSelector(selectSelectedWareHouse);

    let handleTabChangeOnTableLevel = (value) => {
        dispatch(updateSelectedWareHouse(value));
    };

    useEffect(() => {
        dispatch(fetchWareHouseAsync());
        dispatch(resetUserGroupDropDown());
    }, []);

    return (
        <div className="warehouse-main-con">
            <LayoutTabs
                tabs={(wareHouseData && Object.keys(wareHouseData)) || null}
                activeTab={tabValue}
                handleOnChange={handleTabChangeOnTableLevel}
            />

            <div className="ware-house-card-flex">
                {wareHouseLoading ? (
                    <Skeleton />
                ) : (
                    checkObjectIsValid(wareHouseData) &&
                    wareHouseData[tabValue].map((domainData) => (
                        <WareHouse
                            domainData={domainData}
                            tabValue={tabValue}
                            replaceSpacesWithHyphens={replaceSpacesWithHyphens}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default WareHouseController;
