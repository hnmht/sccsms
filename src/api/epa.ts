import { EPCache, ExecutionProject } from "../dataType/types/epa";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Execution Project List
export function reqGetEPList(isLoading: boolean = true): Promise<APIResponse<ExecutionProject[]>> {
    return request({
        url: "/epa/list",
        method: 'post',
        isLoading
    });
}
// Get latest front-end cache
export function reqGetEPCache(data: EPCache, isLoading: boolean = true): Promise<APIResponse<EPCache>> {
    return request({
        url: "/epa/cache",
        method: 'post',
        data,
        isLoading
    });
}
