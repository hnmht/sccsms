import { EpochTime } from "../../i18n/dayjs";
import { SimpEPC } from "../types/epc";
import { getEmptyPerson } from "./person";

export function getEmptySimpEPC(): SimpEPC {
    const epc: SimpEPC = {
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
    return epc
}