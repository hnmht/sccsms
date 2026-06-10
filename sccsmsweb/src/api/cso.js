import request from "../utils/request";

// Get Construction Site Options
export function reqGetCSOs(isLoading = true) {
    return request({
        url: "/cso/options",
        method: "post",
        isLoading
    });
}

// Edit Construction Site Option
export function reqEditCSO(data, isLoading = true) {
    return request({
        url: "/cso/edit",
        method: "post",
        data,
        isLoading
    });
}

// Get CSO front-end Cache
export function reqGetCSOCache(data, isLoading = true) {
    return request({
        url: "/cso/cache",
        method: 'post',
        data,
        isLoading
    });
}