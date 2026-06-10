import { EpochTime } from "../../i18n/dayjs";
import { SimpCSC } from "../types/csc";
import { getEmptyPerson } from "./person";

export function getEmptyCSC(): SimpCSC {
    const csc: SimpCSC = {
        id: 0,
        name: "",
        description: "",
        fatherID: 0,
        status: 0,
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return csc
}