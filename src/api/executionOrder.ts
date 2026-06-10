import { EOCommentsParams, EOListPaging, EOReviewsParams, ExecutionOrder, EOCommentRecord, EOReviewedRecord, ReferExecutionOrder } from "../dataType/types/executionOrder";
import { PagingQueryParams, QueryParams } from "../dataType/types/public";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Add Execution Order
export function reqAddEO(data:ExecutionOrder, isLoading:boolean = true): Promise<APIResponse<ExecutionOrder>> {
    return request({
        url: "/eo/add",
        method: 'post',
        data,
        isLoading
    });
}
// Modify Execution Order
export function reqEditEO(data:ExecutionOrder, isLoading:boolean = true) : Promise<APIResponse<ExecutionOrder>> {
    return request({
        url: "/eo/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Execution Order
export function reqDeleteEO(data:ExecutionOrder, isLoading:boolean = true): Promise<APIResponse<ExecutionOrder>> {
    return request({
        url: "/eo/del",
        method: 'post',
        data,
        isLoading
    });
}
// Confirm Execution Order
export function reqConfirmEO(data:ExecutionOrder, isLoading :boolean= true): Promise<APIResponse<ExecutionOrder>> {
    return request({
        url: "/eo/confirm",
        method: 'post',
        data,
        isLoading
    });
}
// Unconfirm Execution Order 
export function reqUnConfirmEO(data:ExecutionOrder, isLoading :boolean= true):Promise<APIResponse<ExecutionOrder>> {
    return request({
        url: "/eo/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}
// Get Execution Order List
export function reqGetEOList(data:QueryParams, isLoading:boolean = true) :Promise<APIResponse<ExecutionOrder[]>> {
    return request({
        url: "/eo/list",
        method: 'post',
        data,
        isLoading
    });
}

// Get Execution Order list by pagination
export function reqGetEOPaginationList(data:PagingQueryParams, isLoading:boolean = true) :Promise<APIResponse<EOListPaging>> {
    return request({
        url: "/eo/listpage",
        method: 'post',
        data,
        isLoading
    });
}

// Get Execution Order details
export function reqGetEODetail(data:ExecutionOrder, isLoading:boolean = true): Promise<APIResponse<ExecutionOrder>> {
    return request({
        url: "/eo/detail",
        method: 'post',
        data,
        isLoading
    });
}

// Get the list of Execution Orders to be referenced
export function reqReferEO(data:QueryParams, isLoading:boolean = true) :Promise<APIResponse<ReferExecutionOrder[]>> {
    return request({
        url: "/eo/refer",
        method: 'post',
        data,
        isLoading
    });
}

// Add Execution Order comment
export function reqAddEOComment(data:EOCommentRecord, isLoading :boolean= true) : Promise<APIResponse<EOCommentRecord>> {
    return request({
        url: "/eo/addcomment",
        method: 'post',
        data,
        isLoading
    });
}

// Add Execution Order Review Record
export function reqAddEOReview(data:EOReviewedRecord, isLoading:boolean = true) : Promise<APIResponse<EOReviewedRecord>> {
    return request({
        url: "/eo/addreview",
        method: 'post',
        data,
        isLoading
    });
}

// Get the Execution Order Review Record
export function reqGetEOReviews(data:EOReviewsParams, isLoading:boolean = true) : Promise<APIResponse<EOReviewsParams>> {
    return request({
        url: "/eo/reviews",
        method: 'post',
        data,
        isLoading
    });
}

// Get the Execution Order Comments list
export function reqGetEOComments(data:EOCommentsParams, isLoading :boolean= true): Promise<APIResponse<EOCommentsParams>> {
    return request({
        url: "/eo/comments",
        method: 'post',
        data,
        isLoading
    });
}
