import { EpochTime } from "../../i18n/dayjs";
import { Person } from "../types/person";
import { getEmptyFile } from "./file";

export function getEmptyPerson(): Person {
    const file = getEmptyFile();
    const person: Person = {
        id: 0,
        code: "",
        name: "",
        avatar: file,
        deptID: 0,
        deptCode: "",
        deptName: "",
        isOperator: 1,
        positionID: 0,
        positionName: "",
        description: "",
        mobile: "",
        email: "",
        gender: 0,
        systemFlag: 0,
        status: 0,
        createDate: EpochTime,
        ts: EpochTime,
        dr: 0
    };
    return person
}