import { APIResponse } from "../dataType/types/response";
import { UserInfo } from "../dataType/types/user";
import request from "../utils/request";

// Get User Infomation
export function reqUserInfo(isLoading = true): Promise<APIResponse<UserInfo>> {
    return request({
        url: "/user/info",
        method: "post",
        isLoading
    });
}

// Change User's avatar
export function reqChangeAvatar(data: FormData, isLoading = true) {
    return request({
        url: "/user/changeavatar",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data,
        isLoading
    })
}

export function reqModifyProfile(data: UserInfo, isLoading = true): Promise<APIResponse<UserInfo>> {
    return request({
        url: "/user/modifyprofile",
        method: "post",
        data,
        isLoading
    });
}

