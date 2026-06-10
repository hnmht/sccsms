import { SimpDept, SimpDeptCache } from "../dataType/types/department";
import request from "../utils/request";
import { APIResponse } from "../dataType/types/response";

// Get Department list
export function reqGetDepts(isLoading: boolean = true) {
    return request({
        url: "/dept/list",
        method: 'post',
        isLoading
    });
}

// Get Simple Department list
export function reqGetSimpDepts(isLoading: boolean = true): Promise<APIResponse<SimpDept[]>> {
    return request({
        url: "/dept/simplist",
        method: 'post',
        isLoading
    });
}

// Get Simple Department latest front-end cache
export function reqGetSimpDeptsCache(data: SimpDeptCache, isLoading: boolean = true): Promise<APIResponse<SimpDeptCache>> {
    return request({
        url: "/dept/simpcache",
        method: 'post',
        data,
        isLoading
    });
}

