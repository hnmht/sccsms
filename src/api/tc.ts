import { TCCache } from "../dataType/types/tc";
import request from "../utils/request";

// Request Training Course list from backend
export function reqGetTCList(isLoading:boolean = true) {
    return request({
        url: "/tc/list",
        method: 'post',
        isLoading
    });
}
// Request Training Course Frontend Cache from backend
export function reqGetTCCache(data:TCCache, isLoading:boolean = true) {
    return request({
        url: "/tc/cache",
        method: 'post',
        data,
        isLoading
    });
}


