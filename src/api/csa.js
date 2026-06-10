import request from "../utils/request";

// Get Construction Site master data list
export function reqGetCSList(isLoading = true) {
    return request({
        url: "/csa/list",
        method: 'post',
        isLoading
    });
}

// Get Construction Site front-end cache
export function reqGetCSCache(data, isLoading = true) {
    return request({
        url: "/csa/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the CSA code exists
export function reqCheckCSCode(data, isLoading = true) {
    return request({
        url: "/csa/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

// Add Construction Site Archive
export function reqAddCS(data, isLoading = true) {
    return request({
        url: "/csa/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit CSA
export function reqEditCS(data, isLoading = true) {
    return request({
        url: "/csa/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete CSA
export function reqDeleteCS(data, isLoading = true) {
    return request({
        url: "/csa/del",
        method: 'post',
        data,
        isLoading
    });
}

// Batch delete CSA
export function reqDeleteCSs(data, isLoading = true) {
    return request({
        url: "/csa/dels",
        method: 'post',
        data,
        isLoading
    });
}