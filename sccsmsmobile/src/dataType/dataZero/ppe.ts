import { EpochTime } from "../../i18n/dayjs";
import { getEmptyPerson } from "./person";
import { PPE } from "../types/ppe";

export function getEmptyPPE(): PPE {
    const ppe: PPE = {
        id: 0,
        code: "",
        name: "",
        model: "",
        unit: "",
        status: 0,
        description: "",
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return ppe
}