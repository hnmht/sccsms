import { APIResponse } from "../dataType/types/response";
import { UDCCache, UserDefineCategory } from "../dataType/types/udc";
import request from "../utils/request";

// Get UDC list 
export function reqGetUDCList(isLoading: boolean = true): Promise<APIResponse<UserDefineCategory[]>> {
    return request({
        url: "/udc/list",
        method: 'post',
        isLoading
    });
}
// Get latest UDC front-end cache
export function reqGetUDCsCache(data: UDCCache, isLoading: boolean = true): Promise<APIResponse<UDCCache>> {
    return request({
        url: "/udc/cache",
        method: 'post',
        data,
        isLoading
    });
}
