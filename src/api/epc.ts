import { EPC, SimpEPC, SimpEPCCache } from "../dataType/types/epc";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Execution Project Category list
export function reqGetEPCList(isLoading: boolean = true): Promise<APIResponse<EPC[]>> {
    return request({
        url: "/epc/list",
        method: 'post',
        isLoading
    });
}

// Get Simple Execution Project Category list
export function reqGetSimpEPCList(isLoading: boolean = true) :Promise<APIResponse<SimpEPC[]>> {
    return request({
        url: "/epc/simplist",
        method: 'post',
        isLoading
    });
}

// Get SimpEPC front-end cache
export function reqGetSimpEPCCache(data: SimpEPCCache, isLoading: boolean = true) :Promise<APIResponse<SimpEPCCache>> {
    return request({
        url: "/epc/simpcache",
        method: 'post',
        data,
        isLoading
    });
}


