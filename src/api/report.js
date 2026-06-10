import request from "../utils/request";

// Get Work Order Status Report
export function reqWOReport(data, isLoading = true) {
    return request({
        url: "/rep/wor",
        method: 'post',
        data,
        isLoading
    });
}


// Get Execution Order Status Report
export function reqEOReport(data, isLoading = true) {
    return request({
        url: "/rep/eor",
        method: 'post',
        data,
        isLoading
    });
}

// Get Issue Resolution Form Report
export function reqIRFReport(data, isLoading = true) {
    return request({
        url: "/rep/irfr",
        method: 'post',
        data,
        isLoading
    });
}