import { dayjs } from "../../i18n/dayjs"

import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";
import { ScDataTypeList } from "../../dataType/types/scDataType";


// Generate default query fields
export const generateMSGQueryFields = (): QueryField[] => {
    const edQueryFields: QueryField[] = [
        { id: 1, value: "c.sendtime", label: "sendTime", inputType: ScDataTypeList.DateTime, resultField: "" },
        { id: 2, value: "c.billnumber", label: "billNumber", inputType: 301, resultField: "" },
        { id: 3, value: "c.creatorid", label: "sender", inputType: 510, resultField: "id" },
        { id: 4, value: "h.csaid", label: "csa", inputType: 570, resultField: "id" },
        { id: 5, value: "b.epaid", label: "epa", inputType: 560, resultField: "id" },
        { id: 6, value: "c.content", label: "content", inputType: 301, resultField: "" },
        { id: 7, value: "h.billdate", label: "billDate", inputType: ScDataTypeList.Date, resultField: "" }
    ];
    return edQueryFields;
};

// Generate default query conditions
export function generateMsgDefaultCons(): Condition[] {
    const conditions: Condition[] = [
        {
            logic: "and",
            field: { id: 1, value: "c.sendtime", label: "sendTime", inputType: ScDataTypeList.DateTime, resultField: "" },
            compare: greaterThanEqual,
            value: dayjs().weekday(0).startOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "c.sendtime", label: "sendTime", inputType: ScDataTypeList.DateTime, resultField: "" },
            compare: lessThanEqual,
            value: dayjs(new Date()).endOf("day").toISOString(),
            isNecessary: true
        }
    ];
    return conditions;
}