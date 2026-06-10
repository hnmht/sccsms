import request from "../utils/request";

// Get UDC list 
export function reqGetUDCList(isLoading=true) {
    return request({
        url: "/udc/list",
        method: 'post',
        isLoading
    });
}
// Get latest UDC front-end cache
export function reqGetUDCsCache(data, isLoading = true) {
    return request({
        url: "/udc/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add UDC
export function reqAddUDC(data, isLoading = true) {
    return request({
        url: "/udc/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit UDC
export function reqEditUDC(data, isLoading = true) {
    return request({
        url:"/udc/edit",
        method:'post',
        data,
        isLoading
    });
}

// Delete UDC
export function reqDeleteUDC(data, isLoading = true) {
    return request({
        url: "/udc/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch Delete UDC
export function reqDeleteUDCs(data, isLoading = true) {
    return request({
        url: "/udc/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check the UDC's name exists
export function reqCheckUDCName(data, isLoading = true) {
    return request({
        url: "/udc/checkname",
        method: 'post',
        data,
        isLoading
    });
}