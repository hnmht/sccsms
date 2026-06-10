import { ConvertToUnixSecond,dayjs } from "../../i18n/dayjs";
export const Comparisons = [
    { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
    { id: "notequal", label: 'notEqual', value: '!=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
    { id: "lessthan", label: 'lessThan', value: '<', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
    { id: "greaterthan", label: 'greaterThan', value: '>', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
    { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
    { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
    { id: "contain", label: 'contain', value: 'ilike', addCharacter: true, addStart: "%", addEnd: "%", needInput: true, applicable: ["string"] },
    { id: "notcontain", label: 'notContain', value: 'not ilike', addCharacter: true, addStart: "%", addEnd: "%", needInput: true, applicable: ["string"] },
    { id: "null", label: 'null', value: 'is null', addCharacter: false, needInput: false, applicable: ["object", "string", "int", "number"] },
    { id: "notnull", label: 'notNull', value: 'is not null', addCharacter: false, applicable: ["object", "string", "int", "number"] },
];
export const transConditionsToString = (conditions) => {
    let queryString = "";
    conditions.forEach((con, index) => {
        let cs = "";
        if (index !== 0) {
            cs = cs + con.logic + " ";
        }
        cs = cs + con.field.value + " ";
        cs = cs + con.compare.value + " ";
        const compare = con.compare.id;
        if (compare !== "null" && compare !== "notnull") {
            switch (con.field.resultType) {
                case "date":
                case "dateTime":
                    const unixTime = ConvertToUnixSecond(con.value);
                    cs = cs + "to_timestamp(" + unixTime + ") ";
                    break;
                case "number":
                    cs = cs + con.value + " ";
                    break;
                case "int":
                    cs = cs + con.value + " ";
                    break;
                case "string":
                    if (con.compare.addCharacter) {
                        cs = cs + "'" + con.compare.addStart + con.value + con.compare.addEnd + "' ";
                    } else {
                        cs = cs + "'" + con.value + "' ";
                    }
                    break;
                case "object":
                    cs = cs + con.value.id + " ";
                    break;
                default:
                    break
            }
        }        
        queryString = queryString + cs;
    });
    return queryString;
};
