import { EpochTime } from "../../i18n/dayjs";
import { Position } from "../types/postion";
import { getEmptyPerson } from "./person";

export function getEmptyPosition(): Position {
    const position :Position = {
         id: 0,
            name: "",
            description: "",
            status: 0,
            createDate: EpochTime,
            creator: getEmptyPerson(),
            modifyDate:EpochTime,
            modifier: getEmptyPerson(),
            dr: 0,
            ts: EpochTime,
    }
    return position
}