import { ToErrorType, VoucherErrMap } from "../../dataType/types/errors";

export function checkObjectError<T extends object>(errors: ToErrorType<T>): boolean {
    let number = 0;
    for (let key of Object.keys(errors) as Array<keyof T>) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

export function checkVoucherError<T>(errData: VoucherErrMap<T>) {
    let isHeaderErr = false;
    let isBodyErr = false;
    for (const key in errData) {
        const value = (errData as any)[key];
        if (key === "body" && Array.isArray(value)) {
            // Check Voucher body
            for (const row of value) {
                for (const rowKey in row) {
                    if (row[rowKey]?.isErr) {
                        isBodyErr = true;
                        break
                    }
                }
                if (isBodyErr) break;
            }
        } else {
            if (value?.isErr) {
                isHeaderErr = true
            }
        }
        if (isHeaderErr && isBodyErr) break;
    }

    return {isHeaderErr,isBodyErr};
}