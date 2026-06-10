import request from "../utils/request";
// Get Work Order List
export function reqGetWOList(data,isLoading = true) {
    return request({
        url: "/wo/list",
        method: 'post',
        data,
        isLoading
    });
}
// Get Work Order Details
export function reqGetWODetail(data, isLoading = true) {
    return request({
        url: "/wo/detail",
        method: 'post',
        data,
        isLoading
    });
}

// Add Work Order
export function reqAddWO(data, isLoading = true) {
    return request({
        url: "/wo/add",
        method: 'post',
        data,
        isLoading
    });
}

// Modify Work Order
export function reqEditWO(data, isLoading = true) {
    return request({
        url: "/wo/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Work Order
export function reqDeleteWO(data, isLoading = true) {
    return request({
        url: "/wo/del",
        method: 'post',
        data,
        isLoading
    });
}

// Batch Delete Work Order
export function reqDeleteWOs(data, isLoading = true) {
    return request({
        url: "/wo/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Confirm Work Order
export function reqConfirmWO(data, isLoading = true) {
    return request({
        url: "/wo/confirm",
        method: 'post',
        data,
        isLoading
    });
}

// Unconfirm Work Order
export function reqCancelConfirmWO(data, isLoading = true) {
    return request({
        url: "/wo/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}

// Get the list of Work Order awaitng execution
export function reqReferWO(data, isLoading = true) {
    return request({
        url: "/wo/refer",
        method: 'post',
        data,
        isLoading
    });
}

