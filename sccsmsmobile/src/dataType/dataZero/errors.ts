import { ToErrorType, VoucherErrMap } from "../types/errors";
import { ErrMsg } from "../types/scInput";

export function getDefaultErrMsg(): ErrMsg {
    return {
        isErr: false,
        msg: ""
    }
}

export function getFieldErrMsg<T extends object>(
    obj: T,
    defaultValue: ErrMsg
): ToErrorType<T> {
    const result = {} as ToErrorType<T>;
    for (const key of Object.keys(obj) as Array<keyof T>) {
        result[key] = { ...defaultValue };
    }
    return result;
}

export function createVoucherErr<T>(voucher: T): VoucherErrMap<T> {
    const errMsg = getDefaultErrMsg();
    const result: any = {};
    for (const key in voucher) {
        if (key === "body" && Array.isArray((voucher as any)[key])) {
            result[key] = (voucher as any)[key].map((row: any) =>
                createVoucherErr(row)
            );
        } else {
            result[key] = errMsg;
        }
    }
    return result;
}