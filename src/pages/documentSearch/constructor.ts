import { Condition, QueryField } from "../../dataType/types/queryPanel";
import { store } from "../../store";
import { dayjs } from "../../i18n/dayjs";
import { equal, greaterThanEqual, lessThanEqual } from "../../dataType/dataZero/queryPanel";
import { QueryDocument } from "../../dataType/types/document";
// Document query condition fields
export const documentQueryFields: QueryField[] = [
    { id: 1, value: "d.uploaddate", label: "uploadDate", inputType: 306, resultField: "" },
    { id: 2, value: "d.releasedate", label: "releaseDate", inputType: 306, resultField: "" },
    { id: 3, value: "d.dcid", label: "dcID", inputType: 600, resultField: "id" },
    { id: 4, value: "dc.name", label: "dcName", inputType: 301, resultField: "" },
    { id: 5, value: "d.creatorid", label: "creator", inputType: 510, resultField: "id" },
    { id: 6, value: "d.name", label: "name", inputType: 301, resultField: "" },
    { id: 7, value: "d.description", label: "description", inputType: 301, resultField: "" },
    { id: 8, value: "d.author", label: "author", inputType: 301, resultField: "" },
    { id: 9, value: "d.edition", label: "edition", inputType: 301, resultField: "" },
];
;
// Generate Document default query conditions
export function generateDocumentConditions(): Condition[] {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions: Condition[] = [
        {
            logic: "and",
            field: { id: 1, value: "d.uploaddate", label: "uploadDate", inputType: 306, resultField: "" },
            compare: greaterThanEqual,
            value: dayjs().weekday(0).startOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "d.uploaddate", label: "uploadDate", inputType: 306, resultField: "" },
            compare: lessThanEqual,
            value: dayjs().endOf("day").toISOString(),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 5, value: "d.creatorid", label: "creator", inputType: 510, resultField: "id" },
            compare: equal,
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
};

// Sort
export function sortByid(a: QueryDocument, b: QueryDocument) {
    return b.docID - a.docID;
}
