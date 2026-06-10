import { DashBoardData, RiskTrendData } from "../dataType/types/dashboard";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get Dashboard data
export function reqGetDashboardData(data: DashBoardData, isLoading: boolean = true): Promise<APIResponse<DashBoardData>> {
    return request({
        url: "/da/data",
        method: 'post',
        data,
        isLoading
    });
}


// Get Risk Trend data
export function reqGetRiskTrend(data: RiskTrendData, isLoading: boolean = false): Promise<APIResponse<RiskTrendData>> {
    return request({
        url: "/da/risktrend",
        method: 'post',
        data,
        isLoading
    });
}