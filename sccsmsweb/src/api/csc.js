import request from "../utils/request";

// Get CSC list
export function reqGetCSCList(isLoading = true) {
    return request({
        url: "/csc/list",
        method: 'post',
        isLoading
    });
}

//Get Simple CSC list
export function reqGetSimpCSCList(isLoading = true) {
    return request({
        url: "/csc/simplist",
        method: 'post',
        isLoading
    });
}

// Get latest Simple CSC front-end cache
export function reqGetSimpCSCCache(data, isLoading = true) {
    return request({
        url: "/csc/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

// Add CSC master data
export function reqAddCSC(data, isLoading = true) {
    return request({
        url: "/csc/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit CSC master data
export function reqEditCSC(data, isLoading = true) {
    return request({
        url: "/csc/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete CSC master data
export function reqDeleteCSC(data, isLoading = true) {
    return request({
        url: "/csc/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch delete CSCs 
export function reqDeleteCSCs(data, isLoading = true) {
    return request({
        url: "/csc/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the CSC name exists
export function reqCheckCSCName(data, isLoading = true) {
    return request({
        url: "/csc/checkname",
        method: 'post',
        data,
        isLoading
    });
}

