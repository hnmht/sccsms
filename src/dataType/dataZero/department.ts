import { EpochTime } from "../../i18n/dayjs";
import { Department, SimpDept } from "../types/department";
import { getEmptyPerson } from "./person";

export function getEmptySimpDept(): SimpDept {
    const leader = getEmptyPerson();    
    const simpDept: SimpDept = {
        id: 0,
        code: "",
        name: "",
        fatherID: 0,
        leader: leader,
        description: "",
        status: 0,
        createDate: EpochTime,
        ts: EpochTime,
        dr: 0
    };
    return simpDept
}

export function getEmptyDepartment(): Department {
    const emptyPerson = getEmptyPerson();
    const emptySimpDept = getEmptySimpDept();
    const dept: Department = {
        id: 0,
        code: "",
        name: "",
        fatherID: emptySimpDept,
        leader: emptyPerson,
        description: "",
        status: 0,
        createDate: EpochTime,
        creator: emptyPerson,
        modifier: emptyPerson,
        modifyDate: EpochTime,
        ts: EpochTime,
        dr: 0
    }
    return dept;
}

