import request from "../utils/request";

// Get Personal Protective Equipment list
export function reqGetPPEList(isLoading = true) {
    return request({
        url: "/ppe/list",
        method: 'post',
        isLoading
    });
}
// Get PPE front-end cache
export function reqGetPPECache(data, isLoading = true) {
    return request({
        url: "/ppe/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add PPE
export function reqAddPPE(data, isLoading = true) {
    return request({
        url: "/ppe/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit PPE
export function reqEditPPE(data, isLoading = true) {
    return request({
        url: "/ppe/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete PPE
export function reqDeletePPE(data, isLoading = true) {
    return request({
        url: "/ppe/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch Delete PPE
export function reqDeletePPEs(data, isLoading = true) {
    return request({
        url: "/ppe/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check If the PPE code exist
export function reqCheckPPECode(data, isLoading = true) {
    return request({
        url: "/ppe/checkcode",
        method: 'post',
        data,
        isLoading
    });
}