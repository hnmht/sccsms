import { EpochTime } from "../../i18n/dayjs";
import { ConstructionSiteOption } from "../types/cso";
import { getEmptyPerson } from "./person";
import { getEmptyUDA } from "./uda";
import { getEmptyUDC } from "./udc";

export function getEmptyCSO(): ConstructionSiteOption {
    const cso: ConstructionSiteOption = {
        id: 0,
        code: "",
        name: "",
        displayName: "",
        udc: getEmptyUDC(),
        defaultValue: getEmptyUDA(),
        enable: 0,
        isModify: 0,
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return cso
}