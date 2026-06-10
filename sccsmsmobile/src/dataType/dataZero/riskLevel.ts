import { EpochTime } from "../../i18n/dayjs";
import { RiskLevel } from "../types/riskLevel";
import { getEmptyPerson } from "./person";

export function getEmptyRiskLevel(): RiskLevel {
    const rl: RiskLevel = {
        id: 0,
        name: "",
        description: "",
        color: "",
        status: 0,
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifier: getEmptyPerson(),
        modifyDate: EpochTime,
        ts: EpochTime,
        dr: 0,
    }
    return rl
}