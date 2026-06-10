import request from "../utils/request";

// Get Role list
export function reqGetRoles( isLoading = true) {
    return request({
        url: "/role/list",
        method: 'post',
        isLoading
    });
}
// Delete Role
export function reqDeleteRole(data, isLoading = true) {
    return request({
        url: "/role/del",
        method: "post",
        data,
        isLoading
    });
}
// Batch delete Roles
export function reqDeleteRoles(data, isLoading = true) {
    return request({
        url: "/role/dels",
        method: "post",
        data,
        isLoading
    });
}
// Edit Role
export function reqEditRole(data, isLoading = true) {
    return request({
        url: "/role/edit",
        method: "post",
        data,
        isLoading
    });
}
// Check if the Role's name exists
export function reqValidateRoleName(data, isLoading = true) {
    return request({
        url: "/role/checkname",
        method: "post",
        data,
        isLoading
    });
}
// Add Role
export function reqAddRole(data, isLoading = true) {
    return request({
        url: "/role/add",
        method: "post",
        data,
        isLoading
    });
}
// Get role's Menus
export function reqGetRoleAuths(data, isLoading = true) {
    return request({
        url: "/role/getmenu",
        method: "post",
        data,
        isLoading
    });
}
// Update Role's Menus (Modify role permissions)
export function reqUpdateRoleAuths(data, isLoading = true) {
    return request({
        url: "/role/updaterolemenus",
        method: "post",
        data,
        isLoading
    });
}
