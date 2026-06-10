import { EpochTime } from "../../i18n/dayjs";
import { ExecutionProject } from "../types/epa";
import { getEmptySimpEPC } from "./epc";
import { getEmptyPerson } from "./person";
import { getEmptyRiskLevel } from "./riskLevel";
import { getEmptyUDC } from "./udc";
import { getDefaultDataType } from "./scDataType";

export function getEmptyEP(): ExecutionProject {
    const ep: ExecutionProject = {
        id: 0,
        code: "",
        name: "",
        epc: getEmptySimpEPC(),
        description: "",
        status: 0,
        resultType: getDefaultDataType(),
        udc: getEmptyUDC(),
        defaultValue: "0",
        defaultValueDisp: "",
        isCheckError: 0,
        errorValue: "0",
        errorValueDisp: "",
        isRequireFile: 0,
        isOnSitePhoto: 0,
        riskLevel: getEmptyRiskLevel(),
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return ep
}