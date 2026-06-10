import { UserEvents } from "../dataType/types/event";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";
// Get Events for Calendar
export function reqGetEvents(data: UserEvents, isLoading: boolean = true): Promise<APIResponse<UserEvents>> {
    return request({
        url: "/event/list",
        method: 'post',
        data,
        isLoading
    });
}