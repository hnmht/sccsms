
import { DateTimeFormat, dayjs } from "../../../i18n/dayjs";
import store from "../../../store";
import { ConvertFloatFormat } from "../../../utils/tools";
import { VoucherStatus } from "../../../storage/dataTypes";
const examRes = ["unqualified", "qualified"];
// Generate Recieved Training Report condition fields
export const generateReportFields = () => {
    const queryFields = [
        { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 2, value: "h.deptid", label: "deptID", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 3, value: "b.studentid", label: "student", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.tcid", label: "tc", inputType: 620, resultType: "object", resultfield: "id" },
        { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.lecturerid", label: "lecturer", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "h.description", label: "description", inputType: 301, resultType: "string", resultfield: "" },
    ];
    return queryFields;
};
// Generate Recieved Training Report default condition
export function generateReportDefaultCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
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
// Define Recieved Lessons Report columns
export const columnDef = (rows, dispPlayFooter, t) => {
    // Define the aggregate columns
    const aggregateDefine = [
        { id: "examScore", aggregate: "avg" },
        { id: "bClassHour", aggregate: "sum" },
    ];
    // define columns
    let columns = [
        { accessorKey: 'hid', header: 'hid', size: 24 },
        { accessorKey: 'bid', header: 'bid', size: 24 },
        { accessorKey: "billNumber", header: "billNumber", size: 160 },
        { accessorKey: 'billDate', header: 'billDate', size: 128, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "L")}</span>) },
        { accessorKey: 'deptID', header: 'deptID', size: 32 },
        { accessorKey: 'deptCode', header: 'deptCode', size: 64 },
        { accessorKey: 'deptName', header: 'deptName', size: 192 },
        { accessorKey: 'lecturerID', header: 'lecturerID', size: 24 },
        { accessorKey: 'lecturerCode', header: 'lecturerCode', size: 128 },
        { accessorKey: 'lecturerName', header: 'lecturerName', size: 192 },
        { accessorKey: 'tcID', header: 'tcID', size: 32 },
        { accessorKey: 'tcCode', header: 'tcCode', size: 128 },
        { accessorKey: 'tcName', header: 'tcName', size: 192 },
        { accessorKey: 'startTime', header: 'startTime', size: 192, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>) },
        { accessorKey: 'endTime', header: 'endTime', size: 192, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>) },
        { accessorKey: 'tcClassHour', header: 'tcClassHour', size: 128, Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>) },
        { accessorKey: 'isExam', header: 'isExam', size: 96 },
        { accessorKey: 'hStatus', header: 'hStatus', size: 128, Cell: (({ cell }) => <span>{t(VoucherStatus[cell.getValue()])}</span>) },
        { accessorKey: 'hDescription', header: 'hDescription', size: 192 },
        { accessorKey: 'studentID', header: 'studentID', size: 24 },
        { accessorKey: 'studentCode', header: 'studentCode', size: 128 },
        { accessorKey: 'studentName', header: 'studentName', size: 192 },
        { accessorKey: 'studentPositionName', header: 'studentPositionName', size: 192 },
        { accessorKey: 'studentDeptName', header: 'studentDeptName', size: 192 },
        {
            accessorKey: 'bClassHour',
            header: 'bClassHour',
            size: 192,
            Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
        },
        { accessorKey: 'examRes', header: 'examRes', size: 128, Cell: (({ cell }) => <span>{t(examRes[cell.getValue()])}</span>) },
        {
            accessorKey: 'examScore',
            header: 'examScore',
            size: 192,
            Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
        },
        { accessorKey: 'bDescription', header: 'bDescription', size: 192 },
        { accessorKey: 'signStartTime', header: 'signStartTime', size: 192, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>) },
        { accessorKey: 'signEndTime', header: 'signEndTime', size: 192, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>) },
        { accessorKey: 'bStatus', header: 'bStatus', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
        { accessorKey: 'creatorID', header: 'creatorID', size: 100 },
        { accessorKey: 'creatorCode', header: 'creatorCode', size: 128 },
        { accessorKey: 'creatorName', header: 'creatorName', size: 128 },
    ];
    // Translate header
    columns.map(column => {
        column.header = t(column.header);
        return column;
    });

    // Calculate the total
    if (dispPlayFooter) {
        aggregateDefine.forEach((item) => {
            // Find index
            const index = columns.findIndex(column => column.accessorKey === item.id);
            // Calculate the total
            let total = 0;
            let count = 0;
            rows.forEach((row) => {
                count++
                total = total + row[item.id];
            });
            if (item.aggregate === "avg") {
                if (count == 0 ) {
                    total = 0;
                } else {
                    total = ConvertFloatFormat(total / count);
                }                
            }
            columns[index].Footer = () => <span>{t(item.aggregate)}: {total}</span>;
        })
    };
    return columns;
};


// Report default hidden columns
export const defaultHideCol = () => {
    return {
        hid: false,
        bid: false,
        billNumber: false,
        deptID: false,
        deptCode: false,
        deptName: false,
        lecturerID: false,
        lecturerCode: false,
        lecturerName: false,
        tcID: false,
        tcCode: false,
        startTime: false,
        endTime: false,
        tcClassHour: false,
        isExam: false,
        hStatus: false,
        hDescription: false,
        studentID: false,
        studentCode: false,
        bStatus: false,
        creatorID: false,
        creatorCode: false,
        creatorName: false,
    };
};

