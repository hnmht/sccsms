import request from "../utils/request";
// Get Events for Calendar
export function reqGetEvents(data, isLoading = true) {
    return request({
        url: "/event/list",
        method: 'post',
        data,
        isLoading
    });
}