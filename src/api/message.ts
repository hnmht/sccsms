import { ReferExecutionOrder } from "../dataType/types/executionOrder";
import { CommentMessage } from "../dataType/types/message";
import { QueryParams } from "../dataType/types/public";
import { APIResponse } from "../dataType/types/response";
import { WorkOrderRow } from "../dataType/types/workOrder";
import request from "../utils/request";

// Get user UnRead comments
export function reqUnReadComments(isLoading: boolean = true) {
    return request({
        url: "/msg/unread",
        method: 'post',
        isLoading
    });
}

// Get user read comments
export function reqReadComments(data: QueryParams, isLoading: boolean = true) {
    return request({
        url: "/msg/read",
        method: 'post',
        data,
        isLoading
    });
}

// Get user work order awaiting execution
export function reqUserWORefs(isLoading: boolean = true):Promise<APIResponse<WorkOrderRow[]>> {
    return request({
        url: "/msg/wos",
        method: 'post',
        isLoading
    });
}

// Get user execution order issues
export function reqUserEORefs(isLoading: boolean = true):Promise<APIResponse<ReferExecutionOrder[]>> {
    return request({
        url: "/msg/eos",
        method: 'post',
        isLoading
    });
}

// Read message
export function reqToReadMsg(data: CommentMessage, isLoading: boolean = true) {
    return request({
        url: "/msg/toread",
        method: 'post',
        data,
        isLoading
    });
}
