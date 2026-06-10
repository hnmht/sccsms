import request from "../utils/request";

// Request document category list from server
export function reqGetDCList(isLoading = true) {
    return request({
        url: "/dc/list",
        method: 'post',
        isLoading
    });
}

// Request simplified document category list from server
export function reqGetSimpDCList(isLoading = true) {
    return request({
        url: "/dc/simplist",
        method: 'post',
        isLoading
    });
}

// Request simplified document category list from front-end cache
export function reqGetSimpDCCache(data, isLoading = true) {
    return request({
        url: "/dc/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add a document category
export function reqAddDC(data, isLoading = true) {
    return request({
        url: "/dc/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit a document category
export function reqEditDC(data, isLoading = true) {
    return request({
        url: "/dc/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete a document category
export function reqDeleteDC(data, isLoading = true) {
    return request({
        url: "/dc/del",
        method: 'post',
        data,
        isLoading
    });
}
// Bulk delete document categories
export function reqDeleteDCs(data, isLoading = true) {
    return request({
        url: "/dc/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the document category name is Existed
export function reqCheckDCName(data, isLoading = true) {
    return request({
        url: "/dc/checkname",
        method: 'post',
        data,
        isLoading
    });
}

