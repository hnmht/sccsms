import { IssueResolutionForm } from "../dataType/types/issueResolutionForm";
import { QueryParams } from "../dataType/types/public";
import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Add Issue Resolution Form 
export function reqAddIRF(data: IssueResolutionForm, isLoading: boolean = true):Promise<APIResponse<IssueResolutionForm>> {
    return request({
        url: "/irf/add",
        method: 'post',
        data,
        isLoading
    });
}
// Edit Issue Resolution Form
export function reqEditIRF(data: IssueResolutionForm, isLoading: boolean = true): Promise<APIResponse<IssueResolutionForm>> {
    return request({
        url: "/irf/edit",
        method: 'post',
        data,
        isLoading
    });
}
// Delete Issue Resolution Form
export function reqDeleteIRF(data: IssueResolutionForm, isLoading: boolean = true): Promise<APIResponse<IssueResolutionForm>> {
    return request({
        url: "/irf/del",
        method: 'post',
        data,
        isLoading
    });
}
// Confirm Issue Resolution Form
export function reqConfirmIRF(data: IssueResolutionForm, isLoading: boolean = true): Promise<APIResponse<IssueResolutionForm>> {
    return request({
        url: "/irf/confirm",
        method: 'post',
        data,
        isLoading
    });
}
// UnCOnfirm Issue Resolution Form
export function reqUnConfirmIRF(data: IssueResolutionForm, isLoading: boolean = true): Promise<APIResponse<IssueResolutionForm>>{
    return request({
        url: "/irf/unconfirm",
        method: 'post',
        data,
        isLoading
    });
}
// Get Issue Resolution Form List
export function reqIRFList(data: QueryParams, isLoading: boolean = true):Promise<APIResponse<IssueResolutionForm[]>> {
    return request({
        url: "/irf/list",
        method: 'post',
        data,
        isLoading
    });
}