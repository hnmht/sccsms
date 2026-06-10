import { EpochTime } from "../../i18n/dayjs";
import { UserDefinedArchive } from "../types/uda";
import { getEmptyPerson } from "./person";
import { getEmptyUDC } from "./udc";

export function getEmptyUDA(): UserDefinedArchive {
    const uda: UserDefinedArchive = {
        id: 0,
        udc: getEmptyUDC(),
        code: "",
        name: "",
        description: "",
        fatherID: 0,
        status: 0,
        createDate: "",
        creator: getEmptyPerson(),
        modifier: getEmptyPerson(),
        modifyDate: "",
        ts: EpochTime,
        dr: 0,
    }
    return uda
}