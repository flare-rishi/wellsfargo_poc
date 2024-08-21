import { createSlice } from "@reduxjs/toolkit";
import { TEMP_USER_GROUP } from "../../constants/constants";

const initialState = {
    userGroup: null,
    userGroupsList: null,

    inputUserGroup: "",
    userGroupsList: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserGroup: (state, action) => {
            state.userGroup = action.payload;
        },
        updateInputUserGroup: (state, action) => {
            state.inputUserGroup = action.payload;
        },
        updateUserGroupList: (state, action) => {
            state.userGroupsList = action.payload;
        },
        resetUserGroupDropDown: (state) => {
            (state.inputUserGroup = ""), (state.userGroupsList = []), (state.userGroup = null);
        },
    },
});

export const { updateUserGroup, updateUserGroupList, updateInputUserGroup, resetUserGroupDropDown } = userSlice.actions;

export const selectUserGroup = (state) => state.user.userGroup;
export const selectInputUserGroup = (state) => state.user.inputUserGroup;
export const selectUserGroupList = (state) => state.user.userGroupsList;

export default userSlice.reducer;
