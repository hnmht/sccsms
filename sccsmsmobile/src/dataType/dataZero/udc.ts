import { EpochTime } from "../../i18n/dayjs";
import { UserDefineCategory } from "../types/udc";
import { getEmptyPerson } from "./person";

export function getEmptyUDC(): UserDefineCategory {
    const udc: UserDefineCategory = {
        id: 0,
        name: "",
        description: "",
        isLevel: 0,
        status: 0,
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifier: getEmptyPerson(),
        modifyDate: EpochTime,
        ts: EpochTime,
        dr: 0,
    }
    return udc
}