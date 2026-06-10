import { EpochTime,dayjs } from "../../i18n/dayjs";
import { SimpDept } from "../types/department";
import { IssueResolutionForm } from "../types/issueResolutionForm";
import { Person } from "../types/person";
import { getEmptyCSA } from "./csa";
import { getEmptyEP } from "./epa";
import { getEmptyPerson } from "./person";
import { getEmptyRiskLevel } from "./riskLevel";

// Generate empty Issue Execution Order 
export function getEmptyIssueExecutionOrder(person: Person, dept: SimpDept, currentDay: string): IssueResolutionForm {
    const emptyPerson = getEmptyPerson();
    return {
        id: 0,
        billNumber: "",
        billDate: dayjs().startOf("day").toISOString(),
        csa: getEmptyCSA(),
        epa: getEmptyEP(),
        executionValue: "0",
        executionValueDisp: "",
        executor: emptyPerson,
        department: dept,
        issueOwner: person,
        isFinish: 0,
        handler: person,
        startTime: "",
        endTime: "",
        eoDescription: "",
        description: "",
        status: 0,
        sourceType: "EO",
        sourceBillNumber: "",
        sourceHID: 0,
        sourceRowNumber: 0,
        sourceBID: 0,
        riskLevel: getEmptyRiskLevel(),
        sourceRowTs: "",
        issueFiles: [],
        fixFiles: [],
        createDate: currentDay,
        creator: person,
        confirmDate: EpochTime,
        confirmer: emptyPerson,
        modifyDate: EpochTime,
        modifier: emptyPerson,
        ts: "",
        dr: 0,
    };
}