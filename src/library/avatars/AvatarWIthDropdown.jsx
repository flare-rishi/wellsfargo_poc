import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import CustomTextField from "../customInputFields/CustomTextField";
import { useDispatch, useSelector } from "react-redux";
import {
    selectInputUserGroup,
    selectUserGroup,
    selectUserGroupList,
    updateInputUserGroup,
    updateUserGroup,
    updateUserGroupList,
} from "../../slice/userSlices/userSlice";
import { EXPLORE, SMALL, USER } from "../../constants/constants";
import {
    fetchTableExploreAsync,
    fetchTableSchemaAsync,
} from "../../modules/dataDiscovery/slices/tableLevelSlice/tableThunk";
import { useLocation, useParams } from "react-router-dom";
import useGetSearchParams from "../../modules/dataDiscovery/hooks/useLocationHooks/useGetSearchParams";
import { Button } from "@mui/material";
import { selectActiveTab } from "../../slice/tabs/tabSlice";
import {
    selectTableSchema,
    updateTableExplore,
} from "../../modules/dataDiscovery/slices/tableLevelSlice/tableLevelSlice";
import { checkObjectIsValid } from "../../utilities/utilities";

import CustomBasicDropDown from "../customDropDowns/CustomBasicDropDown";

export default function AvatarWithDropdown({}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const userGroup = useSelector(selectUserGroup);
    const inputUserGroup = useSelector(selectInputUserGroup);
    const options = useSelector(selectUserGroupList);
    // const [inputUserGroup, setInputUserGroup] = useState("");
    // const [options, setOptions] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);

    const location = useLocation();

    const dataPathPattern = /^\/data\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/;

    const tableSchema = useSelector(selectTableSchema);
    const activeTab = useSelector(selectActiveTab);

    const dispatch = useDispatch();

    const { domainName, dataSetName, tableName } = useParams();
    let { versionId, forkId } = useGetSearchParams();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [];

    const handleChange = async (e) => {
        await dispatch(updateInputUserGroup(e.target.value));

        await dispatch(updateUserGroup(e.target.value));
        dispatch(
            fetchTableSchemaAsync({
                domainName,
                dataSetName,
                tableName,
                versionId,
                forkId,
            })
        );
        dispatch(
            fetchTableExploreAsync({
                domainName,
                dataSetName,
                tableName,
                versionId,
                forkId,
            })
        );
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (activeTab === EXPLORE && dataPathPattern.test(location.pathname)) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [activeTab, location.pathname]);

    useEffect(() => {
        if (checkObjectIsValid(tableSchema)) {
            let userGroups = tableSchema.groups;
            dispatch(updateUserGroupList(userGroups));
            dispatch(updateInputUserGroup(userGroups[0]));
        }
    }, [tableSchema]);

    return (
        // <Box sx={{ display: "flex", alignItems: "center", padding: "2rem" }}>
        //     <IconButton onClick={handleMenuOpen} color="inherit" size={SMALL}>
        //         <Avatar alt="Profile Picture" src="/static/images/avatar/1.jpg" />
        //     </IconButton>
        //     <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        //         {menuItems.length > 0 &&
        //             menuItems.map((item, index) => (
        //                 <MenuItem
        //                     key={index}
        //                     onClick={() => {
        //                         item.onClick();
        //                         handleMenuClose();
        //                     }}
        //                 >
        //                     {item.label}
        //                 </MenuItem>
        //             ))}
        <div className="user-group-input">
            <form onSubmit={handleOnSubmit} className=" flex-row p">
                {/* <CustomTextField value={inputUserGroup} onChange={handleChange} useCustomInput={false} /> */}

                <CustomBasicDropDown
                    options={options}
                    handleChange={handleChange}
                    value={inputUserGroup}
                    isDisabled={isDisabled}
                />

                {/* <Button type="submit" variant="contained" color="primary" disabled={activeTab !== EXPLORE}>
                    Submit
                </Button> */}
            </form>
        </div>
        //     </Menu>
        // </Box>
    );
}
