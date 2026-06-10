import { APIResponse } from "../dataType/types/response";
import request from "../utils/request";
import { ScFile } from "../dataType/types/file";
import { store } from "../store";
import { i18n } from "../i18n/i18n";
import { ResSuccessCode } from "../dataType/types/response";
import { Alert } from "react-native";
// Upload Files
export function reqUploadFiles(data: FormData, _isLoading: boolean = true): Promise<APIResponse<ScFile[]>> {
    const { appInfo, user } = store.getState();
    const url = `${appInfo.serverAddr}${appInfo.globalPath}/file/receive`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    return fetch(url, {
        method: "POST",
        headers: {
            ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}),
            "XClientType": "scenemob",
            "Accept-Language": i18n.language,
        },
        body: data,
        signal: controller.signal,
    })
        .then(async (resp) => {
            clearTimeout(timeout);
            const res = await resp.json() as APIResponse<ScFile[]>;
            res.status = res.resKey === ResSuccessCode;
            // console.log("[upload] done", { httpStatus: resp.status, resKey: res.resKey, fileCount: res.data?.length ?? 0 });
            if (!res.status) {
                Alert.alert(i18n.t("error"), res.msg || i18n.t("requestReturnError"));
            }
            return res;
        })
        .catch((err) => {
            clearTimeout(timeout);
            console.error("[upload] failed", { name: err?.name, message: err?.message });
            Alert.alert(
                i18n.t("error"),
                err?.name === "AbortError" ? i18n.t("uploadTimeOut") : i18n.t("networkError")
            );
            throw err;
        });
}
// Get file detail by file hash
export function reqGetFileByHash(data: ScFile, isLoading: boolean = true): Promise<APIResponse<ScFile>> {
    return request({
        url: "/file/getfilebyhash",
        method: "post",
        data,
        isLoading
    });
}

// Get file details by hash array
export function reqGetFilesByHash(data: ScFile[], isLoading: boolean = true): Promise<APIResponse<ScFile[]>> {
    return request({
        url: "/file/getfilesbyhash",
        method: "post",
        data,
        isLoading
    });
}
