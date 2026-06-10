import request from "../utils/request";

// Get Document list pagination
export function reqGetDocPage(data, isLoading = true) {
    return request({
        url: "/doc/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get Document Report
export function reqGetDocReport(data, isLoading = true) {
    return request({
        url: "/doc/rep",
        method: 'post',
        data,
        isLoading
    });
}

// Add Document 
export function reqAddDoc(data, isLoading = true) {
    return request({
        url: "/doc/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit Document
export function reqEditDoc(data, isLoading = true) {
    return request({
        url: "/doc/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Document
export function reqDeleteDoc(data, isLoading = true) {
    return request({
        url: "/doc/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch Delete Document
export function reqDeleteDocs(data, isLoading = true) {
    return request({
        url: "/doc/dels",
        method: 'post',
        data,
        isLoading
    });
}
