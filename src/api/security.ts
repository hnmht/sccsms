import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";

// Get RSA Public key
export function reqGetPublicKey(isLoading: boolean = true): Promise<APIResponse<string>> {
    return request({
        url: "/auth/publickey",
        method: "post",
        isLoading
    });
}

// Validate Token
export function reqValidateToken(isLoading: boolean = true): Promise<APIResponse<boolean>> {
    return request({
        url: "/auth/validatetoken",
        method: "post",
        isLoading
    });
}