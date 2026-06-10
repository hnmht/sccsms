import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { store } from "../../store";
import { DateTimeFormat, dayjs } from "../../i18n/dayjs";
import { equal, greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";

// Received Training Report condition fields
export const rtrQueryFields: QueryField[] = [
    { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultField: "" },
    { id: 2, value: "h.deptid", label: "deptID", inputType: 520, resultField: "id" },
    { id: 3, value: "b.studentid", label: "student", inputType: 510, resultField: "id" },
    { id: 4, value: "h.tcid", label: "tc", inputType: 620, resultField: "id" },
    { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultField: "id" },
    { id: 6, value: "h.lecturerid", label: "lecturer", inputType: 510, resultField: "id" },
    { id: 7, value: "h.description", label: "description", inputType: 301, resultField: "" },
];
// Generate Received Training Report default conditions
export function generateRTRConditions() {
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
            field: { id: 3, value: "b.studentid", label: "student", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
};


