import { Position, PositionCache } from "../dataType/types/postion";
import { PPECache } from "../dataType/types/ppe";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get position list
export function reqGetPositionList(isLoading: boolean = true): Promise<APIResponse<Position[]>> {
    return request({
        url: "/position/list",
        method: 'post',
        isLoading
    });
}
// Get latest position master data for front-end cache
export function reqGetPositionCache(data: PositionCache, isLoading: boolean = true): Promise<APIResponse<PPECache>> {
    return request({
        url: "/position/cache",
        method: 'post',
        data,
        isLoading
    });
}
