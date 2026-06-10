import request from "../utils/request";

// Get user UnRead comments
export function reqUnReadComments(isLoading = true) {
    return request({
        url: "/msg/unread",
        method: 'post',
        isLoading
    });
}

// Get user read comments
export function reqReadComments(data,isLoading = true) {
    return request({
        url: "/msg/read",
        method: 'post',
        data,
        isLoading
    });
}

// Get user work order awaiting execution
export function reqUserWORefs(isLoading = true) {
    return request({
        url: "/msg/wos",
        method: 'post',
        isLoading
    });
}

// Get user execution order issues
export function reqUserEORefs(isLoading = true) {
    return request({
        url: "/msg/eos",
        method: 'post',
        isLoading
    });
}

// Read message
export function reqToReadMsg(data,isLoading = true) {
    return request({
        url: "/msg/toread",
        method: 'post',
        data,
        isLoading
    });
}
