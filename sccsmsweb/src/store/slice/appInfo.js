import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    appinfo: undefined,
    needUpdate: 0,
};

export const appinfoSlice = createSlice({
    name: "appinfo",
    initialState,
    reducers: {
        setAppinfo: (state, action) => {
            let appInfo = action.payload;
            state.appinfo = appInfo;
        }
    }
});

export const { setAppinfo } = appinfoSlice.actions;
export default appinfoSlice.reducer;