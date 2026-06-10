import request from "../utils/request";

// Add Personal Protective Equipment Quota
export function reqAddPPEQuota(data, isLoading = true) {
    return request({
        url: "/ppeq/add",
        method: 'post',
        data,
        isLoading
    });
}
// Edit Personal Protective Equipment Quota
export function reqEditPPEQuota(data, isLoading = true) {
    return request({
        url: "/ppeq/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Personal Protective Equipment Quota
export function reqDeletePPEQuota(data, isLoading = true) {
    return request({
        url: "/ppeq/del",
        method: 'post',
        data,
        isLoading
    });
}
// Confirm Personal Protective Equipment Quota
export function reqConfirmPPEQuota(data, isLoading = true) {
    return request({
        url: "/ppeq/confirm",
        method: 'post',
        data,
        isLoading
    });
}
// Unconfirm PPE Quota
export function reqUnconfirmPPEQuota(data, isLoading = true) {
    return request({
        url: "/ppeq/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}
// Chcek if a PPE Position Quota for the same period
export function reqCheckPositionQuota(data, isLoading = true) {
    return request({
        url: "/ppeq/check",
        method: 'post',
        data,
        isLoading
    });
}
// Get the list of all position that have PPE Quotas within the same period
export function reqGetPPEQuotaList(data, isLoading = true) {
    return request({
        url: "/ppeq/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get PPE Quota Detail
export function reqGetPPEQuotaDetail(data, isLoading = true) {
    return request({
        url: "/ppeq/detail",
        method: 'post',
        data,
        isLoading
    });
}

// Get the list of all position that have PPE Quotas within the same period
export function reqGetPeriodPositions(data, isLoading = true) {
    return request({
        url: "/ppeq/positions",
        method: 'post',
        data,
        isLoading
    });
}