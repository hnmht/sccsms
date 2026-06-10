
import { dayjs, EpochTime } from "../../i18n/dayjs"
import { SimpDept } from "../types/department";
import { ExecutionOrder, EOCommentRecord, ExecutionOrderRow } from "../types/executionOrder";
import { Person } from "../types/person";
import { getEmptyCSA } from "./csa";
import { getEmptyEP } from "./epa"
import { getEmptyEPT } from "./ept";
import { getEmptyPerson } from "./person"
import { getEmptyRiskLevel } from "./riskLevel"
// Generate empty Execution Order Row
export function getDefaultExecutionOrderRow(person: Person, currentDay: string): ExecutionOrderRow {
    return {
        id: 0,
        hid: 0,
        rowNumber: 10,
        epa: getEmptyEP(),
        allowDelRow: 1,
        executionValue: "0",
        executionValueDisp: "",
        files: [],
        description: "",
        epaDescription: "",
        isCheckError: 0,
        errorValue: "",
        errorValueDisp: "",
        isRequireFile: 0,
        isOnSitePhoto: 0,
        isIssue: 0,
        isRectify: 0,
        isHandle: 0,
        issueOwner: getEmptyPerson(),
        handleStartTime: "",
        handleEndTime: "",
        status: 0, // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
        isFromEpt: 0,
        isFinish: 0,
        irfID: 0,
        irfNumber: "",
        riskLevel: getEmptyRiskLevel(),
        createDate: currentDay,
        creator: person,
        confirmDate: EpochTime,
        confirmer: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: "",
        dr: 0,
    }
}

// Generate empty Execution Order 
export function getEmptyExecutionOrder(person: Person, dept: SimpDept, currentDay: string): ExecutionOrder {
    const emptyPerson = getEmptyPerson();
    return {
        id: 0, 
        billNumber: "",
        billDate: dayjs().startOf("day").toISOString(),
        department: dept,
        description: "",
        status: 0,
        sourceType: "UA",
        sourceBillNumber: "",
        sourceHID: 0,
        sourceRowNumber: 10,
        sourceBID: 0,
        sourceRowTs: "",
        startTime: dayjs(new Date()).startOf("day").add(9, "hour").toISOString(),
        endTime: dayjs(new Date()).startOf("day").add(17, "hour").toISOString(),
        csa: getEmptyCSA(),
        executor: person,
        ept: getEmptyEPT(),
        allowAddRow: 1,
        allowDelRow: 1,
        body: [],
        issueNumber: 0,
        reviewedNumber: 0,
        reviewedSeconds: 0,
        createDate: currentDay,
        creator: person,
        confirmDate: EpochTime,
        confirmer: emptyPerson,
        modifyDate: EpochTime,
        modifier: emptyPerson,
        ts: currentDay,
        dr: 0,
    }
}

// Generate empty comment
export function getEmptyEOComment(author:Person,hid:number,bid:number,billNumber:string,rowNumber:number,toPerson:Person):EOCommentRecord {
    const currentDay = dayjs(new Date()).toISOString();
    return {
        id:0,
        hid:hid,
        bid:bid,
        billNumber:billNumber,
        rowNumber:rowNumber,
        sendTo:toPerson,
        isRead:0,
        readTime:EpochTime,
        content:"",
        sendTime:currentDay,
        createDate:currentDay,
        creator: author,
        modifyDate:EpochTime,
        modifier:getEmptyPerson(),
        ts:EpochTime,
        dr:0
    }
}