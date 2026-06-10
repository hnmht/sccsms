import { EpochTime } from "../../i18n/dayjs";
import { ConstructionSite } from "../types/csa";
import { CSC } from "../types/csc";
import { SimpDept } from "../types/department";
import { Person } from "../types/person";
import { getEmptyCSC } from "./csc";
import { getEmptySimpDept } from "./department";
import { getEmptyPerson } from "./person";
import { getEmptyUDA } from "./uda";

export function getEmptyCSA(): ConstructionSite {
    const csa: ConstructionSite = {
        id: 0,
        code: "",
        name: "",
        description: "",
        csc: getEmptyCSC(),
        subDept: getEmptySimpDept(),
        respDept: getEmptySimpDept(),
        respPerson: getEmptyPerson(),
        status: 0,
        endFlag: 0,
        endDate: "",
        longitude: 0.01,
        latitude: 0.01,
        udf1: getEmptyUDA(),
        udf2: getEmptyUDA(),
        udf3: getEmptyUDA(),
        udf4: getEmptyUDA(),
        udf5: getEmptyUDA(),
        udf6: getEmptyUDA(),
        udf7: getEmptyUDA(),
        udf8: getEmptyUDA(),
        udf9: getEmptyUDA(),
        udf10: getEmptyUDA(),
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return csa
}

export function isCSALike(v: unknown): v is { id: number, respPerson: Person; respDept: SimpDept; csc: CSC } {
    return typeof v === "object" && v !== null && ("id" in v || "respPerson" in v || "respDept" in v || "csc" in v);
}