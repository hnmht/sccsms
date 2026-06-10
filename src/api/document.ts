import { DCPagingParams, QueryDocument } from "../dataType/types/document";
import { QueryParams } from "../dataType/types/public";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

/* // Get Document list pagination
export function reqGetDocPage(data:DCPagingParams, isLoading:boolean = true) {
    return request({
        url: "/doc/list",
        method: 'post',
        data,
        isLoading
    });
} */

// Get Document Report
export function reqGetDocReport(data:QueryParams, isLoading:boolean = true):Promise<APIResponse<QueryDocument[]>> {
    return request({
        url: "/doc/rep",
        method: 'post',
        data,
        isLoading
    });
}


