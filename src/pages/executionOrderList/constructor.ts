import { store } from "../../store";
import { dayjs } from "../../i18n/i18n";
import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { equal, greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { EPTRepo } from "../../db/crud/ept";
import { EPARepo } from "../../db/crud/epa";
import { personRepo } from "../../db/crud/person";
import { simpDeptRepo } from "../../db/crud/department";
import { simpCSCRepo } from "../../db/crud/csc";
import { UDCRepo } from "../../db/crud/udc";
import { simpEPCRepo } from "../../db/crud/epc";
import { UDARepo } from "../../db/crud/uda";
import { WorkOrderRow } from "../../dataType/types/workOrder";

// Generate Execution Order default query fields
export const eoQueryFields: QueryField[] = [
    { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
    { id: 2, value: "h.billnumber", label: "billNumber", inputType: 301, resultField: "" },
    { id: 3, value: "h.deptid", label: "deptID", inputType: 520, resultField: "id" },
    { id: 4, value: "h.status", label: "status", inputType: 405, resultField: "" },
    { id: 5, value: "h.sourcebillnumber", label: "sourceBillNumber", inputType: 301, resultField: "" },
    { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultField: "id" },
    { id: 7, value: "h.csaid", label: "csa", inputType: 570, resultField: "id" },
    { id: 8, value: "h.createuserid", label: "creator", inputType: 510, resultField: "id" },
    { id: 9, value: "h.eptid", label: "ept", inputType: 580, resultField: "id" }
];


// Generate Execution Order default query conditions
export function generateEOConditions(): Condition[] {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions: Condition[] = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
            compare: greaterThanEqual,
            value: dayjs().subtract(1, "day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
            compare: lessThanEqual,
            value: dayjs(new Date()).toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
// Generate Work Order default field
export const woQueryFields: QueryField[] = [
    { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
    { id: 2, value: "h.billnumber", label: "billNumber", inputType: 301, resultField: "" },
    { id: 3, value: "h.deptid", label: "deptID", inputType: 520, resultField: "id" },
    { id: 4, value: "b.executorid", label: "executor", inputType: 510, resultField: "id" },
    { id: 5, value: "b.csaid", label: "csa", inputType: 570, resultField: "id" },
    { id: 6, value: "b.creatorid", label: "creator", inputType: 510, resultField: "id" },
    { id: 7, value: "b.eptid", label: "ept", inputType: 580, resultField: "id" }
];
// Generate Work Order default query conditions
export function generateWOConditions(): Condition[] {
    const { user } = store.getState();
    const currentPerson = user.person;
    const conditions: Condition[] = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
            compare: greaterThanEqual,
            value: dayjs().weekday(0).toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
            compare: lessThanEqual,
            value: dayjs(new Date()).toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 4, value: "b.executorid", label: "executor", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}


// Execution Order sort function
export function eosSortByID(a: ExecutionOrder, b: ExecutionOrder) {
    return b.id - a.id;
}


// Convert Execution Order to frontend
export const transEODetailToFronted = (eoDetail: ExecutionOrder) => {
    // Get Execution Project Templete ID
    const eptID = eoDetail.ept.id;
    eoDetail.ept = EPTRepo.getDetailByID(eptID);
    for (let row of eoDetail.body) {
        // Get body Execution Project detail
        const epaID = row.epa.id;
        row.epa = EPARepo.getDetailByID(epaID);
        // Convert executionValue and errorValue
        switch (row.epa.resultType.id) {
            case 301:
            case 306:
            case 307:
                break;
            case 302:
                row.executionValue = parseFloat(row.executionValue);
                row.errorValue = parseFloat(row.errorValue);
                break;
            case 401:
            case 404:
                row.executionValue = parseInt(row.executionValue);
                row.errorValue = parseInt(row.errorValue);
                break;
            case 510:
                row.executionValue = personRepo.getDetailByID(parseInt(row.executionValue));
                row.errorValue = personRepo.getDetailByID(parseInt(row.errorValue));
                break;
            case 520:
                row.executionValue = simpDeptRepo.getDetailByID(parseInt(row.executionValue));
                row.errorValue = simpDeptRepo.getDetailByID(parseInt(row.errorValue));
                break;
            case 525:
                row.executionValue = simpCSCRepo.getDetailByID(parseInt(row.executionValue));
                row.errorValue = simpCSCRepo.getDetailByID(parseInt(row.errorValue));
                break;
            case 530:
                row.executionValue = UDCRepo.getDetailByID(parseInt(row.executionValue));
                row.errorValue = UDCRepo.getDetailByID(parseInt(row.errorValue));
                break;
            case 540:
                row.executionValue = simpEPCRepo.getDetailByID(parseInt(row.executionValue));
                row.errorValue = simpEPCRepo.getDetailByID(parseInt(row.errorValue));
                break;
            case 550:
                row.executionValue = UDARepo.getDetailByID(parseInt(row.executionValue));
                row.errorValue = UDARepo.getDetailByID(parseInt(row.errorValue));
                break;
            default:
                console.error("No matching DataType");
                throw new Error("transEODetailToFronted failed: No matching DataType");
        }
    }
    return eoDetail;
};

export function worsSortByid(a: WorkOrderRow, b: WorkOrderRow) {
    return b.id - a.id;
}