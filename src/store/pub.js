import { reqUserInfo } from "../api/user";
import { reqLogout } from "../api/login";
import { reqPubSysInfo } from "../api/pub";
import store from "./index";
import { resetUser, setUserInfo } from "./slice/user";
import { setAppinfo } from "./slice/appInfo";
import { getToken } from "../storage/token";
import { reqUnReadComments, reqUserEORefs, reqUserWORefs } from "../api/message";
import { setDynamicMessages, setDynamicCSOs, setDynamicEORefs, setDynamicWORefs } from "./slice/dynamicData";
import { reqGetCSOs } from "../api/cso";

// Logout
export const logout = async () => {
    const res = await reqLogout();
    if (!res.status) {
        console.warn(res.msg);
    }
    store.dispatch(resetUser());
};
// Get User Details
export const getUserInfo = async () => {
    const token = getToken();
    if (!token) {
        return false;
    }
    const userInfoRes = await reqUserInfo(token, false);
    if (!userInfoRes.status) {
        console.warn(userInfoRes.data.statusMsg);
        return false;
    }
    const latestUserInfo = userInfoRes.data;
    store.dispatch(setUserInfo(latestUserInfo));
    return true;
};

// Request App Information from backend server
export const getAppInfo = async () => {
    const res = await reqPubSysInfo();
    let newInfo = undefined;
    if (res.status) {
        newInfo = res.data;
    }
    store.dispatch(setAppinfo(newInfo));
};

// Request Dynamic Messages
export const getDynamicMessages = async (loading = false) => {
    let newUnreadMsgs = [];
    const res = await reqUnReadComments(loading);
    if (res.status) {
        newUnreadMsgs = res.data;
    }
    store.dispatch(setDynamicMessages(newUnreadMsgs));
};

// Request Dynamic CSO
export const getDynamicCSO = async (loading = false) => {
    let newCSO = [];
    const res  = await reqGetCSOs(loading);
    if (res.status) {
        newCSO= res.data;
    }
    store.dispatch(setDynamicCSOs(newCSO));
};

// Request Dynamic Execution Order Reference
export const getDynamicEORef = async (loading = false) => {
    let newEORefs = [];
    const res = await reqUserEORefs(loading);
    if (res.status) {
        newEORefs = res.data;
    }
    store.dispatch(setDynamicEORefs(newEORefs));
};

// Request Dynamic Work Order Row Reference
export const getDynamicWORef = async (loading = false) => {
    let newWoRefs = [];
    const res = await reqUserWORefs(loading);
    if (res.data) {
        newWoRefs = res.data;
    }
    store.dispatch(setDynamicWORefs(newWoRefs));
};

// Request all Dynamic Data
export const getDynamicData = async () => {
    await getDynamicCSO();
    await getDynamicMessages();
    await getDynamicEORef();
    await getDynamicWORef();
};