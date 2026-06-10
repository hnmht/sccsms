import request from "../utils/request";
import { ParamLogin, ParamChangePwd } from "../dataType/types/login";
import { APIResponse } from "../dataType/types/response";

// Login
export function reqLogin(data: ParamLogin, isLoading: boolean = true): Promise<APIResponse<string>> {
    return request({
        url: '/auth/login',
        method: 'post',
        data,
        isLoading
    })
}
// Logout
export function reqLogout(isLoading: boolean = true): Promise<APIResponse<undefined>> {
    return request({
        url: '/auth/logout',
        method: 'post',
        isLoading
    })
}
// Change Password
export function reqChangePwd(data: ParamChangePwd, isLoading: boolean = true): Promise<APIResponse<undefined>> {
    return request({
        url: '/auth/changepwd',
        method: 'post',
        data,
        isLoading
    })
}