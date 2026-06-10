import { dayjs } from "../../i18n/dayjs"
import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";
import { WorkOrder } from "../../dataType/types/workOrder";

// Generate default query fields
export const queryFields: QueryField[] = [
    { id: 1, value: "workorder_h.billdate", label: "billDate", inputType: 306, resultField: "" },
    { id: 2, value: "workorder_h.billnumber", label: "billNumber", inputType: 301, resultField: "" },
    { id: 3, value: "workorder_h.deptid", label: "deptID", inputType: 520, resultField: "id" },
    { id: 4, value: "workorder_h.status", label: "status", inputType: 405, resultField: "" },
    { id: 5, value: "department.name", label: "deptName", inputType: 301, resultField: "" },
    { id: 6, value: "department.code", label: "deptCode", inputType: 301, resultField: "" },
    { id: 7, value: "workorder_h.creatorid", label: "creator", inputType: 510, resultField: "id" },
];
// Generate default query conditions
export const generateConditions = (): Condition[] => [
    {
        logic: "and",
        field: { id: 1, value: "workorder_h.billdate", label: "billDate", inputType: 306, resultField: "" },
        compare: greaterThanEqual,
        value: dayjs().subtract(1, "day").toISOString(),
        isNecessary: true
    },
    {
        logic: "and",
        field: { id: 1, value: "workorder_h.billdate", label: "billDate", inputType: 306, resultField: "" },
        compare: lessThanEqual,
        value: dayjs(new Date()).toISOString(),
        isNecessary: true
    }
];

// Work Order Sort Function
export function wosSortByid(a: WorkOrder, b: WorkOrder) {
    return b.id - a.id;
}

