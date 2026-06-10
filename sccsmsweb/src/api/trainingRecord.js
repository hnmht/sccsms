import request from "../utils/request";

// Add Training Record
export function reqAddTR(data, isLoading = true) {
    return request({
        url: "/tr/add",
        method: 'post',
        data,
        isLoading
    });
}
// Edit Training Record
export function reqEditTR(data, isLoading = true) {
    return request({
        url: "/tr/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Training Record
export function reqDeleteTR(data, isLoading = true) {
    return request({
        url: "/tr/del",
        method: 'post',
        data,
        isLoading
    });
}
// Confirm Training Record
export function reqConfirmTR(data, isLoading = true) {
    return request({
        url: "/tr/confirm",
        method: 'post',
        data,
        isLoading
    });
}
// UnConfirm Training Record
export function reqUnConfirmTR(data, isLoading = true) {
    return request({
        url: "/tr/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}
// Get Training Record List
export function reqGetTRList(data, isLoading = true) {
    return request({
        url: "/tr/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get Record Training Record Detail
export function reqGetTRDetail(data, isLoading = true) {
    return request({
        url: "/tr/detail",
        method: 'post',
        data,
        isLoading
    });
}

// Get Taught Lessons Report
export function reqGetTaughtLessonsReport(data, isLoading = true) {
    return request({
        url: "/tr/tlrep",
        method: 'post',
        data,
        isLoading
    });
}

// Get Recived Training Report
export function reqGetRecivedTrainingReport(data, isLoading = true) {
    return request({
        url: "/tr/rtrep",
        method: 'post',
        data,
        isLoading
    });
}