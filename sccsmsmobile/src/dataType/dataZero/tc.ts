import { EpochTime } from "../../i18n/dayjs";
import { TC } from "../types/tc";
import { getEmptyPerson } from "./person";
import { getEmptyVoucherFile } from "./voucherFile";
export function getEmptyTC(): TC {
    const tc: TC = {
        id: 0,
        code: "",
        name: "",
        classHour: 0,
        isExamine: 0,
        description: "",
        status: 0,
        files: [getEmptyVoucherFile()],
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return tc;
}