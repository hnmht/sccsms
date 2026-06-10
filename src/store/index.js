import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user";
import reqStatusReducer from "./slice/reqStatus";
import appInfoReducer from "./slice/appInfo";
import dynamicDataReducer from "./slice/dynamicData";

export default configureStore({
    reducer: {
        appinfo: appInfoReducer,
        user: userReducer,
        reqStatus: reqStatusReducer,
        dynamicData:dynamicDataReducer        
    }
});

