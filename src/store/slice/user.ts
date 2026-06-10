import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../../dataType/types/user";
import { getEmptyUser } from "../../dataType/dataZero/user";

const updateStateFromUserInfo = (state: UserInfo, userInfo: UserInfo) => {
    state.id = userInfo.id;
    state.code = userInfo.code;
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.menuList = userInfo.menuList;
    state.person = userInfo.person;
    state.department = userInfo.department;
};

const initialState: UserInfo = getEmptyUser();

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserToken: (state, action:PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUserTokenFromDb: (state, action:PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUserInfo: (state, action:PayloadAction<UserInfo>) => {
            const userInfo = action.payload;
            updateStateFromUserInfo(state,userInfo);          
        },
        setUserInfoFromDb: (state, action:PayloadAction<UserInfo>) => {
            const userInfo = action.payload;
            updateStateFromUserInfo(state, userInfo);    
        },
        resetUser: () => getEmptyUser()
    }
});

export const { setUserToken, setUserTokenFromDb, setUserInfo, setUserInfoFromDb, resetUser } = userSlice.actions;
export default userSlice.reducer;