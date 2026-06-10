import request from "../utils/request";

// Get Risk Level list
export function reqGetRLList(isLoading = true) {
    return request({
        url: "/rl/list",
        method: 'post',
        isLoading
    });
}
// Get latest Risk Level front-end cache
export function reqGetRLsCache(data, isLoading = true) {
    return request({
        url: "/rl/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add RL
export function reqAddRL(data, isLoading = true) {
    return request({
        url: "/rl/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit RL
export function reqEditRL(data, isLoading = true) {
    return request({
        url: "/rl/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete RL
export function reqDeleteRL(data, isLoading = true) {
    return request({
        url: "/rl/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch delete RL
export function reqDeleteRLs(data, isLoading = true) {
    return request({
        url: "/rl/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the Risk Level name exists
export function reqCheckRLName(data, isLoading = true) {
    return request({
        url: "/rl/checkname",
        method: 'post',
        data,
        isLoading
    });
}