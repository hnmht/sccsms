import { configureStore } from "@reduxjs/toolkit";
import appinfoReducer from "./slice/appInfo";
import userReducer from "./slice/user";
import reqStatusReducer from "./slice/reqStatus";
import dynamicDataReducer from "./slice/dynamicData";
// import loadStatusReducer from "./slice/loadStatus";
import swapPosition from "./slice/swapPosition";
import locationReducer from "./slice/location";

export const store = configureStore({
    reducer: {
        appInfo: appinfoReducer,
        user: userReducer,
        reqStatus: reqStatusReducer,
        dynamicData: dynamicDataReducer,
        // loadstatus: loadStatusReducer,
        swapPosition: swapPosition,
        location: locationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
