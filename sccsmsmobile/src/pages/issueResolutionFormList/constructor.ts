import { store } from "../../store";
import { dayjs } from "../../i18n/i18n";
import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { equal, greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";
import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";

// Refer Execution Order sort function
export function reoSortByID(a: ReferExecutionOrder, b: ReferExecutionOrder) {
    return b.id - a.id;
}

// Issue Resolution Form sort function 
export function irfSortByID(a: IssueResolutionForm, b: IssueResolutionForm) {
    return b.id - a.id;
}

// Pending Issue Query Fields in Execution Order
export const eoQueryFields: QueryField[] = [
    { id: 1, value: "b.handlestarttime", label: "handleStartTime", inputType: 306, resultField: "" },
    { id: 2, value: "b.epaid", label: "epa", inputType: 560, resultField: "id" },
    { id: 3, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultField: "id" },
    { id: 4, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
    { id: 5, value: "h.billnumber", label: "billNumber", inputType: 301, resultField: "" },
    { id: 6, value: "h.deptid", label: "department", inputType: 520, resultField: "id" },
    { id: 7, value: "h.executorid", label: "executor", inputType: 510, resultField: "id" },
    { id: 8, value: "h.csaid", label: "csa", inputType: 570, resultField: "id" },
];

// Generate Execution Order default query conditions
export function generateEOConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions: Condition[] = [
        {
            logic: "and",
            field: { id: 1, value: "b.handlestarttime", label: "handleStartTime", inputType: 306, resultField: "" },
            compare: greaterThanEqual,
            value: dayjs().weekday(0).toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "b.handlestarttime", label: "handleStartTime", inputType: 306, resultField: "" },
            compare: lessThanEqual,
            value: dayjs().endOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 3, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}

// Issue Resolution Form Query Fields
export const irfQueryFields: QueryField[] = [
    { id: 1, value: "b.billdate", label: "billdate", inputType: 306, resultField: "" },
    { id: 2, value: "b.epaid", label: "epa", inputType: 560, resultField: "id" },
    { id: 3, value: "b.csaid", label: "csa", inputType: 570, resultField: "id" },
    { id: 4, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultField: "id" },
    { id: 5, value: "b.starttime", label: "startTime", inputType: 307, resultField: "" },
    { id: 6, value: "b.endtime", label: "endTime", inputType: 307, resultField: "" },
    { id: 7, value: "b.billnumber", label: "billNumber", inputType: 301, resultField: "" },
    { id: 8, value: "b.deptid", label: "department", inputType: 520, resultField: "id" },
    { id: 9, value: "b.executorid", label: "executor", inputType: 510, resultField: "id" },
    { id: 10, value: "b.sourcebillnumber", label: "sourceBillNumber", inputType: 301, resultField: "" }
];

// Generate Issue Resolution Form default query conditions
export function generateIRFConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions: Condition[] = [
        {
            logic: "and",
            field: irfQueryFields[0],
            compare: greaterThanEqual,
            value: dayjs().weekday(0).startOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: irfQueryFields[0],
            compare: lessThanEqual,
            value: dayjs().endOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: irfQueryFields[3],
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
