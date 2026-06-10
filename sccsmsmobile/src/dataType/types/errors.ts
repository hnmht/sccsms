import { ErrMsg } from "./scInput";

export type ToErrorType<T> = {
    [K in keyof T]: ErrMsg
}

export type VoucherErrMap<T> = {
    [K in keyof T]:
    K extends "body"
    ? T[K] extends Array<infer R>
    ? VoucherErrMap<R>[]
    : never
    : ErrMsg;
};