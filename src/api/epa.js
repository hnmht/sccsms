import request from "../utils/request";

// Get Execution Project List
export function reqGetEPList(isLoading = true) {
    return request({
        url: "/epa/list",
        method: 'post',
        isLoading
    });
}
// Get latest front-end cache
export function reqGetEPCache(data, isLoading = true) {
    return request({
        url: "/epa/cache",
        method: 'post',
        data,
        isLoading
    });
}
// Add EP
export function reqAddEP(data, isLoading = true) {
    return request({
        url: "/epa/add",
        method: 'post',
        data,
        isLoading
    });
}
// Edit EP
export function reqEditEP(data, isLoading = true) {
    return request({
        url: "/epa/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete EP
export function reqDeleteEP(data, isLoading = true) {
    return request({
        url: "/epa/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch delete EP
export function reqDeleteEPs(data, isLoading = true) {
    return request({
        url: "/epa/dels",
        method: 'post',
        data,
        isLoading
    });
}
// Check if the EP's code exists
export function reqCheckEPCode(data, isLoading = true) {
    return request({
        url: "/epa/checkcode",
        method: 'post',
        data,
        isLoading
    });
}