import { APIResponse } from "../dataType/types/response";
import { UDACache, UserDefinedArchive } from "../dataType/types/uda";
import { UserDefineCategory } from "../dataType/types/udc";
import request from "../utils/request";

// Get UDA list under the UDC
export function reqGetUDAList(data: UserDefineCategory, isLoading: boolean = true): Promise<APIResponse<UserDefinedArchive[]>> {
    return request({
        url: "/uda/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get ALL UDA
export function reqGetUDAAll(isLoading: boolean = true) :Promise<APIResponse<UserDefinedArchive[]>>{
    return request({
        url: "/uda/all",
        method: 'post',
        isLoading
    });
}

// Get latest UDA front-end cache
export function reqGetUDACache(data: UDACache, isLoading: boolean = true) :Promise<APIResponse<UDACache>> {
    return request({
        url: "/uda/cache",
        method: 'post',
        data,
        isLoading
    });
}
