import request from "../utils/request";

// Request Training Course list from backend
export function reqGetTCList(isLoading = true) {
    return request({
        url: "/tc/list",
        method: 'post',
        isLoading
    });
}
// Request Training Course Frontend Cache from backend
export function reqGetTCCache(data, isLoading = true) {
    return request({
        url: "/tc/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add new Training Course
export function reqAddTC(data, isLoading = true) {
    return request({
        url: "/tc/add",
        method: 'post',
        data,
        isLoading
    });
}

// Modify Training Course
export function reqEditTC(data, isLoading = true) {
    return request({
        url: "/tc/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete Training Course
export function reqDeleteTC(data, isLoading = true) {
    return request({
        url: "/tc/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch Delete Training Courses
export function reqDeleteTCs(data, isLoading = true) {
    return request({
        url: "/tc/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if Training Course name is duplicate
export function reqCheckTCName(data, isLoading = true) {
    return request({
        url: "/tc/checkname",
        method: 'post',
        data,
        isLoading
    });
}

