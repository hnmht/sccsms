import { SimpDC, SimpDCCache } from "../dataType/types/dc";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// // Request document category list from server
// export function reqGetDCList(isLoading = true) {
//     return request({
//         url: "/dc/list",
//         method: 'post',
//         isLoading
//     });
// }

// Request simplified document category list from server
export function reqGetSimpDCList(isLoading = true):Promise<APIResponse<SimpDC[]>> {
    return request({
        url: "/dc/simplist",
        method: 'post',
        isLoading
    });
}

// Request simplified document category list from front-end cache
export function reqGetSimpDCCache(data:SimpDCCache, isLoading = true):Promise<APIResponse<SimpDCCache>> {
    return request({
        url: "/dc/cache",
        method: 'post',
        data,
        isLoading
    });
}



