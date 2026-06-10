import request from "../utils/request";

// Get Dashboard data
export function reqGetDashboardData(data,isLoading = true) {
    return request({
        url: "/da/data",
        method: 'post',
        data,
        isLoading
    });
}


// Get Risk Trend data
export function reqGetRiskTrend(data, isLoading = false) {
    return request({
        url: "/da/risktrend",
        method: 'post',
        data,
        isLoading
    });
}