import request from "../utils/request";

// Get User Infomation
export function reqUserInfo(data,isLoading=true) {
    return request({
        url: "/user/info",
        method: "post",
        data,
        isLoading
    });
}
// Get User List
export function reqGetUsers( isLoading = true) {
    return request({
        url: "/user/list",
        method: 'post',
        isLoading
    });
}

// Delete User
export function reqDeleteUser(data, isLoading = true) {
    return request({
        url: "/user/del",
        method: "post",
        data,
        isLoading
    });
}
// Batch Delete Users
export function reqDeleteUsers(data, isLoading = true) {
    return request({
        url: "/user/dels",
        method: "post",
        data,
        isLoading
    });
}

// Add User
export function reqAddUser(data, isLoading = true) {
    return request({
        url: "/user/add",
        method: "post",
        data,
        isLoading
    });
}
// Edit User
export function reqEditUser(data, isLoading = true) {
    return request({
        url: "/user/edit",
        method: "post",
        data,
        isLoading
    });
}
// Modifiy User Profile
export function reqModifyProfile(data, isLoading = true) {
    return request({
        url: "/user/modifyprofile",
        method: "post",
        data,
        isLoading
    });
}

// Check if the User's code exists
export function reqValidateUserCode(data, isLoading = true) {
    return request({
        url: "/user/checkcode",
        method: "post",
        data,
        isLoading
    });
}
// Check if the user's name exists
export function reqValidateUserName(data, isLoading = true) {
    return request({
        url: "/user/checkname",
        method: "post",
        data,
        isLoading
    });
}

// Change User's avatar
export function reqChangeAvatar(data, isLoading = true) {
    return request({
        url: "/user/changeavatar",
        method: "post",
        headers: { "Content-Type":"multipart/form-data"},        
        data,
        isLoading
    })
}

