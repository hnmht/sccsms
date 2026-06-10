import { ErrMsg } from "../types/scInput";

export function getEmptyErrMsg() :ErrMsg {
    return {
        isErr:false,
        msg:""
    }
}