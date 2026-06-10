import request from "../utils/request";

// Get Execution Project Template list
export function reqGetEPTList(isLoading = true) {
    return request({
        url: "/ept/list",
        method: 'post',
        isLoading
    });
}

// Get lstest Execution Project Template List for front-end cache
export function reqGetEPTCache(data, isLoading = true) {
    return request({
        url: "/ept/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add Execution Project Template
export function reqAddEPT(data, isLoading = true) {
    return request({
        url: "/ept/add",
        method: 'post',
        data,
        isLoading
    });
}

// Modify Execution Project Template
export function reqEditEPT(data, isLoading = true) {
    return request({
        url: "/ept/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete Execution Project Template
export function reqDeleteEPT(data, isLoading = true) {
    return request({
        url: "/ept/del",
        method: 'post',
        data,
        isLoading
    });
}

// Batch delete Execution Project Templates
export function reqDeleteEPTs(data, isLoading = true) {
    return request({
        url: "/ept/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if EPT code is unique
export function reqCheckEPTCode(data, isLoading = true) {
    return request({
        url: "/ept/checkcode",
        method: 'post',
        data,
        isLoading
    });
}