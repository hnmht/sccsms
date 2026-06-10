import { ConstructionSite, ConstructionSiteCache } from "../dataType/types/csa";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Construction Site master data list
export function reqGetCSList(isLoading: boolean = true): Promise<APIResponse<ConstructionSite[]>> {
    return request({
        url: "/csa/list",
        method: 'post',
        isLoading
    });
}

// Get Construction Site front-end cache
export function reqGetCSCache(data: ConstructionSiteCache, isLoading = true): Promise<APIResponse<ConstructionSiteCache>> {
    return request({
        url: "/csa/cache",
        method: 'post',
        data,
        isLoading
    });
}

