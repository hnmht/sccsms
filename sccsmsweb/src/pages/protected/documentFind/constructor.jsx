import { DateTimeFormat, dayjs } from "../../../i18n/dayjs";
import { i18n } from "../../../i18n/i18n";
import ScInput from "../../../component/ScInput";
import store from "../../../store";

// Generate Document Query condition fields
export const generateDocReportFields = () => {
    const documentQueryFields = [
        { id: 1, value: "d.uploaddate", label: "uploadDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 2, value: "d.releasedate", label: "releaseDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 3, value: "d.dcid", label: "dcID", inputType: 600, resultType: "object", resultfield: "id" },
        { id: 4, value: "dc.name", label: "dcName", inputType: 301, resultType: "string", resultfield: "" },
        { id: 5, value: "d.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "d.name", label: "name", inputType: 301, resultType: "string", resultfield: "" },
        { id: 7, value: "d.description", label: "description", inputType: 301, resultType: "string", resultfield: "" },
        { id: 8, value: "d.author", label: "author", inputType: 301, resultType: "string", resultfield: "" },
        { id: 9, value: "d.edition", label: "edition", inputType: 301, resultType: "string", resultfield: "" },
    ];
    return documentQueryFields;
};

// Generate Document default query condition
export function generateDocReportDefaultCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "d.uploaddate", label: "uploadDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "d.uploaddate", label: "uploadDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).endOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 5, value: "d.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}
// Define the report columns
export const columnDef = () => {
    let columns = [
        { accessorKey: 'docID', header: 'docID', size: 40 },
        { accessorKey: 'docName', header: 'docName', size: 160 },
        { accessorKey: "dcID", header: "dcID", size: 20 },
        { accessorKey: 'dcName', header: 'dcName', size: 150 },
        { accessorKey: 'edition', header: 'edition', size: 100 },
        { accessorKey: 'author', header: 'author', size: 100 },
        {
            accessorKey: "uploadDate", header: "uploadDate", size: 160,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: "releaseDate", header: "releaseDate", size: 160,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        { accessorKey: 'description', header: 'description', size: 200 },
        {
            accessorKey: "files", header: "files", size: 140, enableClickToCopy: false,
            Cell: (({ cell }) => {
                return <ScInput
                    dataType={902}
                    allowNull={true}
                    isEdit={false}
                    itemShowName="files"
                    itemKey={cell.id}
                    initValue={cell.getValue()}
                    pickDone={() => { }}
                    isBackendTest={false}
                    positionID={1}
                    key="files"
                />
            }
            )
        },
        { accessorKey: 'creatorID', header: 'creatorID', size: 20 },
        { accessorKey: 'creatorCode', header: 'creatorCode', size: 30 },
        { accessorKey: 'creatorName', header: 'creatorName', size: 160 }
    ];
    // Translate header
    columns.map(column => {
        column.header = i18n.t(column.header);
        return column;
    });
    return columns;
}
// Document Report default hidden columns
export const defaultHideCol = () => {
    return {
        docID: false,
        dcID: false,
        creatorID: false,
        creatorCode: false,
    };
};