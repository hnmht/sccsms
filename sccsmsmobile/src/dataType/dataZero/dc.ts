import { EpochTime } from "../../i18n/dayjs";
import { SimpDC } from "../types/dc";
import { getEmptyPerson } from "./person";

export function getEmptySimpDC(): SimpDC {
    const dc: SimpDC = {
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

    return dc
}