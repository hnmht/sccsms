import { EPT, EPTCache } from "../dataType/types/ept";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Execution Project Template list
export function reqGetEPTList(isLoading:boolean = true) :Promise<APIResponse<EPT[]>> {
    return request({
        url: "/ept/list",
        method: 'post',
        isLoading
    });
}

// Get lstest Execution Project Template List for front-end cache
export function reqGetEPTCache(data:EPTCache, isLoading = true) :Promise<APIResponse<EPTCache>> {
    return request({
        url: "/ept/cache",
        method: 'post',
        data,
        isLoading
    });
}
