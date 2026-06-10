
import { dayjs} from "../../../i18n/dayjs";
import store from "../../../store";
import { VoucherStatus } from "../../../storage/dataTypes";
import { ConvertFloatFormat } from "../../../utils/tools";
// Generate Taught Lessons Report condition fields
export const generateReportFields = () => {
    const queryFields = [
        { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "h.deptid", label: "deptID", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 3, value: "h.lecturerid", label: "lecturer", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.tcid", label: "tc", inputType: 620, resultType: "object", resultfield: "id" },
        { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.description", label: "description", inputType: 301, resultType: "string", resultfield: "" },
    ];
    return queryFields;
};

// Generate Taught Lessons Report default condition
export function generateReportDefaultCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).endOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 5, value: "h.creatorID", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
};
// Define Taught Lessons Report columns
export const columnDef = (rows, displayFooter, t) => {
    // Define the aggregate columns
    const totalRowDefine = [
        { id: "classHour", aggregate: "sum" },
        { id: "studentNumber", aggregate: "sum" },
        { id: "disqualificationNumber", aggregate: "sum" },
        { id: "qualifiedNumber", aggregate: "sum" }
    ];
    // Define columns
    let columns = [
        { accessorKey: 'hid', header: 'hid', size: 64 },
        { accessorKey: "billNumber", header: "billNumber", size: 160 },
        { accessorKey: 'billDate', header: 'billDate', size: 128, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD")}</span>) },
        { accessorKey: 'deptID', header: 'deptID', size: 32 },
        { accessorKey: 'deptCode', header: 'deptCode', size: 64 },
        { accessorKey: 'deptName', header: 'deptName', size: 192 },
        { accessorKey: 'description', header: 'description', size: 192 },
        { accessorKey: 'lecturerID', header: 'lecturerID', size: 24 },
        { accessorKey: 'lecturerCode', header: 'lecturerCode', size: 128 },
        { accessorKey: 'lecturerName', header: 'lecturerName', size: 192 },
        { accessorKey: 'trainingDate', header: 'trainingDate', size: 32 },
        { accessorKey: 'tcID', header: 'tcID', size: 32 },
        { accessorKey: 'tcCode', header: 'tcCode', size: 128 },
        { accessorKey: 'tcName', header: 'tcName', size: 192 },
        { accessorKey: 'startTime', header: 'startTime', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
        { accessorKey: 'endTime', header: 'endTime', size: 192, Cell: (({ cell }) => <span>{dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm")}</span>) },
        {
            accessorKey: 'classHour', header: 'classHour', size: 128,
            Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
        },
        { accessorKey: 'isExam', header: 'isExam', size: 96 },
        { accessorKey: 'studentNumber', header: 'studentNumber', size: 128 },
        { accessorKey: 'qualifiedNumber', header: 'qualifiedNumber', size: 128 },
        { accessorKey: 'disqualificationNumber', header: 'disqualificationNumber', size: 172 },
        { accessorKey: 'status', header: 'status', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
        { accessorKey: 'creatorID', header: 'creatorID', size: 100 },
        { accessorKey: 'creatorCode', header: 'creatorCode', size: 128 },
        { accessorKey: 'creatorName', header: 'creatorName', size: 128 },
    ];

    //Translate header
    columns.map(column => {
        column.header = t(column.header);
        return column;
    });

    // Calculate the total
    if (displayFooter) {
        totalRowDefine.forEach((item) => {
            // Find Index
            const index = columns.findIndex(column => column.accessorKey === item.id);
            // Calculate the total
            let total = 0;
            rows.forEach((row) => {
                total = total + row[item.id];
            });
            columns[index].Footer = () => <span>{t(item.aggregate)}: {total}</span>;
        });
    }

    return columns;
}
// Report default hidden columns
export const defaultHideCol = () => {
    return {
        hid: false,
        deptID: false,
        deptCode: false,
        trainingDate: false,
        lecturerID: false,
        lecturerCode: false,
        tcID: false,
        tcCode: false,
        isExam: false,
        creatorID: false,
        creatorCode: false,
    };
};