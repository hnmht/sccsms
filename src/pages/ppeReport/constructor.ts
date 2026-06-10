import { store } from "../../store";
import { dayjs } from "../../i18n/dayjs";
import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { equal, greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";

// PPE Issuance Form Report query condition fields
export const ppeIFRQueryFields: QueryField[] = [
    { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
    { id: 2, value: "b.ppeid", label: "ppeID", inputType: 630, resultField: "id" },
    { id: 3, value: "ppe.name", label: "ppeName", inputType: 301, resultField: "" },
    { id: 4, value: "ppe.model", label: "ppeModel", inputType: 301, resultField: "" },
    { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultField: "id" },
    { id: 6, value: "h.description", label: "description", inputType: 301, resultField: "" },
    { id: 7, value: "b.recipientid", label: "recipientID", inputType: 510, resultField: "id" },
    { id: 8, value: "h.status", label: "status", inputType: 405, resultField: "" },
    { id: 9, value: "b.positionname", label: "recipientPositionName", inputType: 301, resultField: "" },
    { id: 10, value: "b.deptname", label: "recipientDeptName", inputType: 301, resultField: "" },
    { id: 11, value: "h.deptid", label: "issuingDeptID", inputType: 520, resultField: "id" },
];
// Generate PPE Issuance Form Report Query condition fields
export function generatePPEIFRConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions: Condition[] = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
            compare: greaterThanEqual,
            value: dayjs().weekday(0).startOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
            compare: lessThanEqual,
            value: dayjs().endOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 7, value: "b.recipientid", label: "recipientID", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
};




