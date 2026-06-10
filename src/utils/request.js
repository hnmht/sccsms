import axios from "axios";
import { getToken, removeToken } from "../storage/token";
import store from "../store";
import { resetUser } from "../store/slice/user";
import { requestStart, requestEnd } from "../store/slice/reqStatus";
import { resetDynamicData } from "../store/slice/dynamicData";
import { message } from "mui-message";
import { i18n } from "../i18n/i18n";

const service = axios.create({
    baseURL: "/api/v1", //"http://localhost:8080/api/v1"
    timeout: 15000,
});

const removeTokenCodes = ["CodeInvalidToken", "CodeNeedLogin", "CodeTokenDestroy", "CodeLoginOther"];
const successCode = "StatusOK"

// Request interceptor
service.interceptors.request.use(
    (config) => {
        if (config.isLoading) {
            store.dispatch(requestStart());
        }
        const userToken = getToken();
        if (userToken !== null) {
            config.headers.Authorization = "Bearer " + userToken;
        }
        config.headers.XClientType = "sceneweb";
        config.headers["Accept-Language"] = i18n.language;
        return config;
    },
    (error) => {
        console.error("axios Request interceptor failed:", error);
        Promise.reject(error);
    }
);

// Response interceptor
service.interceptors.response.use(
    (response) => {
        if (response.config.isLoading) {
            store.dispatch(requestEnd());
        }
        const res = response.data;
        if (res.resKey === successCode) {
            // Add a boolean field for easier future checks
            res.status = true;
        } else {
            res.status = false;
            message.error(res.msg);
            if (removeTokenCodes.includes(res.resKey)) {
                // Remove token from local storage
                removeToken();
                // Clear user information in Redux
                store.dispatch(resetUser());
                // Clear Dynamic data in Redux
                store.dispatch(resetDynamicData());
            }
        }
        return res;
    },
    (error) => {
        message.error(error.message);
        store.dispatch(requestEnd());
        return {
            resKey: "httpServerError",
            status: false,
            msg: error.message,
            data: ""
        };
    }
);

export default service;