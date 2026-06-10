import request from "../utils/request";

// Login
export function reqLogin(data, isLoading = true) {   
    return request({
        url: '/auth/login',
        method: 'post',
        data,
        isLoading
    })
}
// Logout
export function reqLogout(data, isLoading = true) {    
    return request({
        url: '/auth/logout',
        method: 'post',
        data,
        isLoading
    })
}
// Change Password
export function reqChangePwd(data, isLoading = true) {    
    return request({
        url: '/auth/changepwd',
        method: 'post',
        data,
        isLoading
    })
}