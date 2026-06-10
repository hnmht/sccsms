import request from "../utils/request";

// Get Department list
export function reqGetDepts(isLoading=true) {
    return request({
        url: "/dept/list",
        method: 'post',
        isLoading
    });
}

// Get Simple Department list
export function reqGetSimpDepts(isLoading = true) {
    return request({
        url: "/dept/simplist",
        method: 'post',
        isLoading
    });
}

// Get Simple Department latest front-end cache
export function reqGetSimpDeptsCache(data, isLoading = true) {
    return request({
        url: "/dept/simpcache",
        method: 'post',
        data,
        isLoading
    });
}
 
// Add Department
export function reqAddDept(data,isLoading = true) {
    return request({
        url: "/dept/add",
        method: 'post',
        data,
        isLoading
    });
}

// Edit Department
export function reqEditDept(data, isLoading = true) {
    return request({
        url: "/dept/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Department
export function reqDelDept(data, isLoading = true) {
    return request({
        url: "/dept/del",
        method: 'post',
        data,
        isLoading
    });
}
// Batch delete Department
export function reqDeleteDepts(data, isLoading = true) {
    return request({
        url: "/dept/dels",
        method: "post",
        data,
        isLoading
    });
}

// Check if the department code exists
export function reqValidateDeptCode(data, isLoading = true) {
    return request({
        url: "/dept/checkcode",
        method: 'post',
        data,
        isLoading
    });
}