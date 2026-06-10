import { ConstructionSiteOption, ConstructionSiteOptionCache } from "../dataType/types/cso";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Construction Site Options
export function reqGetCSOs(isLoading = true):Promise<APIResponse<ConstructionSiteOption[]>> {
    return request({
        url: "/cso/options",
        method: "post",
        isLoading
    });
}

// Get CSO front-end Cache
export function reqGetCSOCache(data:ConstructionSiteOptionCache, isLoading = true) :Promise<APIResponse<ConstructionSiteOptionCache>> {
    return request({
        url: "/cso/cache",
        method: 'post',
        data,
        isLoading
    });
}