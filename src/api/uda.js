import request from "../utils/request";

// Get UDA list under the UDC
export function reqGetUDAList(data,isLoading=true) {
    return request({
        url: "/uda/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get ALL UDA
export function reqGetUDAAll(isLoading = true) {
    return request({
        url: "/uda/all",
        method: 'post',
        isLoading
    });
}

// Get latest UDA front-end cache
export function reqGetUDACache(data, isLoading = true) {
    return request({
        url: "/uda/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add UDA
export function reqAddUDA(data, isLoading = true) {
    return request({
        url: "/uda/add",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the UDA code exists
export function reqCheckUDACode(data, isLoading = true) {
    return request({
        url: "/uda/checkcode",
        method: 'post',
        data,
        isLoading
    });
}

// Edit UDA
export function reqEditUDA(data, isLoading = true) {
    return request({
        url: "/uda/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete UDA
export function reqDeleteUDA(data, isLoading = true) {
    return request({
        url: "/uda/del",
        method: 'post',
        data,
        isLoading
    });
}

// Batch Delete UDA
export function reqDeleteUDAs(data, isLoading = true) {
    return request({
        url: "/uda/dels",
        method: 'post',
        data,
        isLoading
    });
}