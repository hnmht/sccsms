import { store } from "../../store";
import { dayjs } from "../../i18n/i18n";
import { Condition } from "../../dataType/types/queryPanel";
import { equal, greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";

// Generate Execution Order default query conditions
export function generateEOConditions() {
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
    ];

    if (user.department && user.department.id !== 0) {
        conditions.push({
            logic: "and",
            field: { id: 3, value: "h.deptid", label: "deptID", inputType: 520, resultField: "id" },
            compare: equal,
            value: user.department,
            isNecessary: false
        })
    } else {
        conditions.push({
            logic: "and",
            field: { id: 6, value: "h.executorid", label: "executor", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        })
    }

    return conditions;
}