import {PPE, PPECache } from "../dataType/types/ppe";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Personal Protective Equipment list
export function reqGetPPEList(isLoading: boolean = true) :Promise<APIResponse<PPE[]>> {
    return request({
        url: "/ppe/list",
        method: 'post',
        isLoading
    });
}
// Get PPE front-end cache
export function reqGetPPECache(data: PPECache, isLoading: boolean = true) :Promise<APIResponse<PPECache>> {
    return request({
        url: "/ppe/cache",
        method: 'post',
        data,
        isLoading
    });
}
