import request from "../utils/request";

// Get Execution Project Category list
export function reqGetEPCList(isLoading = true) {
    return request({
        url: "/epc/list",
        method: 'post',
        isLoading
    });
}

// Get Simple Execution Project Category list
export function reqGetSimpEPCList(isLoading = true) {
    return request({
        url: "/epc/simplist",
        method: 'post',
        isLoading
    });
}

// Get SimpEPC front-end cache
export function reqGetSimpEPCCache(data, isLoading = true) {
    return request({
        url: "/epc/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

// Add EPC
export function reqAddEPC(data, isLoading = true) {
    return request({
        url: "/epc/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit EPC
export function reqEditEPC(data, isLoading = true) {
    return request({
        url: "/epc/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete EPC
export function reqDeleteEPC(data, isLoading = true) {
    return request({
        url: "/epc/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch delete EPC
export function reqDeleteEPCs(data, isLoading = true) {
    return request({
        url: "/epc/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the EPC name exists
export function reqCheckEPCName(data, isLoading = true) {
    return request({
        url: "/epc/checkname",
        method: 'post',
        data,
        isLoading
    });
}

