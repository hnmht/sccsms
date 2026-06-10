import { VoucherFile } from "../types/voucherFile";
import { getEmptyFile } from "./file";
import { getEmptyPerson } from "./person";
export function getEmptyVoucherFile(): VoucherFile {
    const vFile: VoucherFile = {
        id: 0,
        billBID: 0,
        billHID: 0,
        file: getEmptyFile(),
        createDate: "",
        creator: getEmptyPerson(),
        modifyDate: "",
        modifier: getEmptyPerson(),
        ts: "",
        dr: 0,
    }
    return vFile
}