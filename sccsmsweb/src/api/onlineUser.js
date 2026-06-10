import request from "../utils/request"; 

// Get Online User list
export function reqGetOnlineUsers(isLoading = true) {
    return request({
        url: "/ou/list",
        method: 'post',
        isLoading
    });
}

// Remove Online User
export function reqRemoveOnlineUser(data, isLoading = true) {
    return request({
        url: "/ou/remove",
        method: 'post',
        data,
        isLoading
    });
}