import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppInfo, ServerInfo } from "../../dataType/types/appInfo";
import { getEmptyAppInfo } from "../../dataType/dataZero/appInfo";

const initialState: AppInfo = getEmptyAppInfo();

export const appinfoSlice = createSlice({
    name: "appInfo",
    initialState,
    reducers: {
        setDbid: (state, action: PayloadAction<string>) => {
            state.dbID = action.payload;
        },
        setGlobalPath: (state, action: PayloadAction<string>) => {
            state.globalPath = action.payload;
        },
        setIsOffline: (state, action: PayloadAction<0 | 1>) => {
            state.isOffline = action.payload;
        },
        setServerAddr: (state, action: PayloadAction<string>) => {
            state.serverAddr = action.payload;
        },
        setServerInfo: (state, action: PayloadAction<ServerInfo>) => {
            state.serverInfo = action.payload;
        },
        setInfoFromDb: (state, action: PayloadAction<AppInfo>) => {
            state.serverInfo = action.payload.serverInfo;
            state.dbID = action.payload.dbID;
            state.isOffline = action.payload.isOffline;
            state.serverAddr = action.payload.serverAddr;
            state.globalPath = action.payload.globalPath;
        }
    }
});

export const { setDbid, setIsOffline, setServerInfo, setServerAddr, setInfoFromDb, setGlobalPath } = appinfoSlice.actions;

export default appinfoSlice.reducer;