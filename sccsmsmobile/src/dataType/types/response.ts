
export const ResRemoveTokenCodes: string[] = ["CodeInvalidToken", "CodeNeedLogin", "CodeTokenDestroy", "CodeLoginOther"];
export const ResSuccessCode: string = "StatusOK";

export interface ServerStatus {
    apiPath: string;
    name: string;
}

export interface APIResponse<T> {
    status?: boolean; 
    resKey: string;
    msg: string;
    data: T;
}
