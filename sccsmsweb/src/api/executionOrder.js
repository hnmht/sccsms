import request from "../utils/request";

// Add Execution Order
export function reqAddEO(data, isLoading = true) {
    return request({
        url: "/eo/add",
        method: 'post',
        data,
        isLoading
    });
}
// Modify Execution Order
export function reqEditEO(data, isLoading = true) {
    return request({
        url: "/eo/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Execution Order
export function reqDeleteEO(data, isLoading = true) {
    return request({
        url: "/eo/del",
        method: 'post',
        data,
        isLoading
    });
}
// Confirm Execution Order
export function reqConfirmEO(data, isLoading = true) {
    return request({
        url: "/eo/confirm",
        method: 'post',
        data,
        isLoading
    });
}
// Unconfirm Execution Order 
export function reqUnConfirmEO(data, isLoading = true) {
    return request({
        url: "/eo/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}
// Get Execution Order List
export function reqGetEOList(data, isLoading = true) {
    return request({
        url: "/eo/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get Execution Order list by pagination
export function reqGetEOPaginationList(data, isLoading = true) {
    return request({
        url: "/eo/listpage",
        method: 'post',
        data,
        isLoading
    });
}

// Get Execution Order details
export function reqGetEODetail(data, isLoading = true) {
    return request({
        url: "/eo/detail",
        method: 'post',
        data,
        isLoading
    });
}

// Get the list of Execution Orders to be referenced
export function reqReferEO(data, isLoading = true) {
    return request({
        url: "/eo/refer",
        method: 'post',
        data,
        isLoading
    });
}

// Add Execution Order comment
export function reqAddEOComment(data, isLoading = true) {
    return request({
        url: "/eo/addcomment",
        method: 'post',
        data,
        isLoading
    });
}

// Add Execution Order Review Record
export function reqAddEOReview(data, isLoading = true) {
    return request({
        url: "/eo/addreview",
        method: 'post',
        data,
        isLoading
    });
}

// Get the Execution Order Review Record
export function reqGetEOReviews(data, isLoading = true) {
    return request({
        url: "/eo/reviews",
        method: 'post',
        data,
        isLoading
    });
}

// Get the Execution Order Comments list
export function reqGetEOComments(data, isLoading = true) {
    return request({
        url: "/eo/comments",
        method: 'post',
        data,
        isLoading
    });
}
