import request from "../utils/request";

// Get Public System Information
export function reqPubSysInfo(isLoading = true) {
    return request({
        url: "/pub/sysinfo",
        method: "post",
        isLoading
    });
}

// Generate front-end DBID
export function reqGenerateFrontDBID(data, isLoading = true) {
    return request({
        url: "/pub/addfrontdbid",
        method: "post",
        data,
        isLoading
    });
}

// Get front-end DBID
export function reqGetFrontDBID(data, isLoading = true) {
    return request({
        url: "/pub/getfrontdbid",
        method: "post",
        data,
        isLoading
    });
}

