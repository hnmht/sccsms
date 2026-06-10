import { dayjs } from "../../../i18n/dayjs";

// Generate Message Query Fields
export const generateMSGQueryFields = () => {
    const edQueryFields = [
        { id: 1, value: "c.sendTime", label: "sendTime", inputType: 307, resultType: "date", resultfield: "" },
        { id: 2, value: "c.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "c.creatorid", label: "sender", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 5, value: "b.epaid", label: "epa", inputType: 560, resultType: "object", resultfield: "id" },
        { id: 6, value: "c.content", label: "content", inputType: 301, resultType: "string", resultfield: "" }
    ];
    return edQueryFields;
};

// Generate  Messages default Conditions
export function generateMsgDefaultCons() {
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "c.sendTime", label: "sendTime", inputType: 307, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date","object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "c.sendTime", label: "sendTime", inputType: 307, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date","object", "string", "int", "number"] },
            value: dayjs(new Date()).endOf("day"),
            isNecessary: true
        }
    ];
    return conditions;
}