import request from "../utils/request";

// Add PPE Issuance Form 
export function reqAddPPEIF(data, isLoading = true) {
    return request({
        url: "/ppeif/add",
        method: 'post',
        data,
        isLoading
    });
}
// Using wizard to generate PPE Issuance Form
export function reqWizardAddPPEIF(data, isLoading = true) {
    return request({
        url: "/ppeif/wizard",
        method: 'post',
        data,
        isLoading
    });
}
// Modify PPE Issuance Form
export function reqEditPPEIF(data, isLoading = true) {
    return request({
        url: "/ppeif/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete PPE Issuance Form 
export function reqDeletePPEIF(data, isLoading = true) {
    return request({
        url: "/ppeif/del",
        method: 'post',
        data,
        isLoading
    });
}
// Confirm PPE Issuance Form
export function reqConfirmPPEIF(data, isLoading = true) {
    return request({
        url: "/ppeif/confirm",
        method: 'post',
        data,
        isLoading
    });
}
// Unconfirm PPE Issuance Form
export function reqUnconfirmPPEIF(data, isLoading = true) {
    return request({
        url: "/ppeif/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}
// Get PPE Issuance Form List
export function reqGetPPEIFList(data, isLoading = true) {
    return request({
        url: "/ppeif/list",
        method: 'post',
        data,
        isLoading
    });
}
// Get PPE Issuance Form Report
export function reqGetPPEIFReport(data, isLoading = true) {
    return request({
        url: "/ppeif/rep",
        method: 'post',
        data,
        isLoading
    });
}

// Get PPE Issuance Form detail
export function reqGetPPEIFDetail(data, isLoading = true) {
    return request({
        url: "/ppeif/detail",
        method: 'post',
        data,
        isLoading
    });
}