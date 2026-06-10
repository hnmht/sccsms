export interface ReqStatus {
    reqLoading: boolean;
}

export interface CustomRequestConfig<T = any> {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    data?: T;
    params?: Record<string, string | number | boolean | null | undefined>;
    timeout?: number;
    signal?: AbortSignal;
    isLoading?: boolean;
}
