import request from "../utils/request";

// Get position list
export function reqGetPositionList(isLoading = true) {
    return request({
        url: "/position/list",
        method: 'post',
        isLoading
    });
}
// Get latest position master data for front-end cache
export function reqGetPositionCache(data, isLoading = true) {
    return request({
        url: "/position/cache",
        method: 'post',
        data,
        isLoading
    });
}

// Add position
export function reqAddPosition(data, isLoading = true) {
    return request({
        url: "/position/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit position
export function reqEditPosition(data, isLoading = true) {
    return request({
        url: "/position/edit",
        method: 'post',
        data,
        isLoading
    });
}

// Delete position
export function reqDeletePosition(data, isLoading = true) {
    return request({
        url: "/position/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch delete position
export function reqDeletePositions(data, isLoading = true) {
    return request({
        url: "/position/dels",
        method: 'post',
        data,
        isLoading
    });
}

// Check if the position name exists
export function reqCheckPositionName(data, isLoading = true) {
    return request({
        url: "/position/checkname",
        method: 'post',
        data,
        isLoading
    });
}