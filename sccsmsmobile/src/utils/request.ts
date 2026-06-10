import { Alert } from "react-native";
import { store } from "../store";
import { i18n } from "../i18n/i18n";
import { requestStart, requestEnd } from "../store/slice/reqStatus";
import { setUserToken } from "../store/slice/user";
import { APIResponse, ResSuccessCode, ResRemoveTokenCodes } from "../dataType/types/response";
import { CustomRequestConfig } from "../dataType//types/request";

const DEFAULT_TIMEOUT = 15000;

function withQuery(url: string, params?: CustomRequestConfig["params"]): string {
    if (!params) {
        return url;
    }
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }
        query.append(key, String(value));
    });
    const queryStr = query.toString();
    if (!queryStr) {
        return url;
    }
    return `${url}${url.includes("?") ? "&" : "?"}${queryStr}`;
}

function isFormData(value: unknown): value is FormData {
    return typeof FormData !== "undefined" && value instanceof FormData;
}

export default async function request<T = any>(config: CustomRequestConfig): Promise<APIResponse<T>> {
    const {
        url,
        method = "post",
        data,
        params,
        isLoading = true,
        timeout = DEFAULT_TIMEOUT,
        headers = {},
        signal: externalSignal,
    } = config;

    const { appInfo } = store.getState();
    const token = store.getState().user.token;
    const finalUrl = withQuery(`${appInfo.serverAddr}${appInfo.globalPath}${url}`, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (externalSignal) {
        externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }

    const requestHeaders: Record<string, string> = {
        ...headers,
        XClientType: "scenemob",
        "Accept-Language": i18n.language,
    };
    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    const upperMethod = method.toUpperCase();
    const hasBody = data !== undefined && upperMethod !== "GET";
    if (hasBody && !isFormData(data) && !requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
    }

    if (isLoading) {
        store.dispatch(requestStart());
    }

    try {
        const response = await fetch(finalUrl, {
            method: upperMethod,
            headers: requestHeaders,
            body: hasBody ? (isFormData(data) ? data : JSON.stringify(data)) : undefined,
            signal: controller.signal,
        });

        const res = await response.json() as APIResponse<T>;
        res.status = res.resKey === ResSuccessCode;

        if (!res.status) {
            Alert.alert(i18n.t("error"), res.msg || "请求返回错误", [{ text: "OK" }], { cancelable: false });
            if (ResRemoveTokenCodes.includes(res.resKey)) {
                store.dispatch(setUserToken(""));
            }
        }
        return res;
    } catch (err: any) {
        Alert.alert(
            i18n.t("error"),
            err?.name === "AbortError" || err?.message === "Network Error" || err?.message === "Network request failed"
                ? "网络错误，请检查设备网络！"
                : "连接服务器失败，请稍后再试！"
        );
        throw err;
    } finally {
        clearTimeout(timeoutId);
        if (isLoading) {
            store.dispatch(requestEnd());
        }
    }
}
