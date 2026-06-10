import { DateTimeFormat, dayjs } from "../../../i18n/dayjs";
import store from "../../../store";
import { i18n } from "../../../i18n/i18n";
import { VoucherStatus } from "../../../storage/dataTypes";
import { ConvertFloatFormat } from "../../../utils/tools";


// Generate PPE Issuance Form Report query condition fields
export const generateReportFields = () => {
    const queryFields = [
        { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "string", resultfield: "" },
        { id: 2, value: "b.ppeid", label: "ppeID", inputType: 630, resultType: "object", resultfield: "id" },
        { id: 3, value: "ppe.name", label: "ppeName", inputType: 301, resultType: "string", resultfield: "" },
        { id: 4, value: "ppe.model", label: "ppeModel", inputType: 301, resultType: "string", resultfield: "" },
        { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 6, value: "h.description", label: "description", inputType: 301, resultType: "string", resultfield: "" },
        { id: 7, value: "b.recipientid", label: "recipientID", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 8, value: "h.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
        { id: 9, value: "b.positionname", label: "recipientPositionName", inputType: 301, resultType: "string", resultfield: "" },
        { id: 10, value: "b.deptname", label: "recipientDeptName", inputType: 301, resultType: "string", resultfield: "" },
        { id: 11, value: "h.deptid", label: "issuingDeptID", inputType: 520, resultType: "object", resultfield: "id" },

    ];
    return queryFields;
};
// Generate PPE Issuance Form query conditions
export function generateReportDefaultCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).startOf("week"),
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
            field: { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
};

// Define the report columns
export const columnDef = () => {
    let columns = [
        { accessorKey: 'hid', header: 'hid', size: 24 },
        { accessorKey: 'bid', header: 'bid', size: 160 },
        { accessorKey: "rowNumber", header: "rowNumber", size: 128 },
        { accessorKey: 'recipientID', header: 'recipientID', size: 24 },
        { accessorKey: 'recipientCode', header: 'recipientCode', size: 120 },
        { accessorKey: 'recipientName', header: 'recipientName', size: 192 },
        { accessorKey: 'recipientPositionName', header: 'recipientPositionName', size: 192 },
        { accessorKey: 'recipientDeptName', header: 'recipientDeptName', size: 192 },
        { accessorKey: 'ppeID', header: 'ppeID', size: 24 },
        { accessorKey: 'ppeCode', header: 'ppeCode', size: 128 },
        { accessorKey: 'ppeName', header: 'ppeName', size: 192 },
        { accessorKey: 'ppeModel', header: 'ppeModel', size: 192 },
        { accessorKey: 'ppeUnit', header: 'ppeUnit', size: 128 },
        {
            accessorKey: 'quantity', header: 'quantity', size: 128,
            Cell: (({ cell }) => <span style={{ textAlign: "right", paddingRight: 4, width: "80px" }}>{ConvertFloatFormat(cell.getValue())}</span>),
        },
        { accessorKey: 'bDescription', header: 'bDescription', size: 256 },
        { accessorKey: 'bStatus', header: 'bStatus', size: 128, Cell: (({ cell }) => <span>{VoucherStatus[cell.getValue()]}</span>) },
        { accessorKey: 'billNumber', header: 'billNumber', size: 172 },
        { accessorKey: 'billDate', header: 'billDate', size: 128, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "L")}</span>) },
        { accessorKey: 'issuingDeptID', header: 'issuingDeptID', size: 100 },
        { accessorKey: 'issuingDeptCode', header: 'issuingDeptCode', size: 128 },
        { accessorKey: 'issuingDeptName', header: 'issuingDeptName', size: 192 },
        { accessorKey: 'hDescription', header: 'hDescription', size: 256 },
        { accessorKey: 'period', header: 'period', size: 128, Cell: (({ cell }) => <span>{i18n.t(cell.getValue())}</span>) },
        { accessorKey: 'startDate', header: 'startDate', size: 128, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>) },
        { accessorKey: 'endDate', header: 'endDate', size: 128, Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>) },
        { accessorKey: 'sourceType', header: 'sourceType', size: 100 },
        { accessorKey: 'hStatus', header: 'hStatus', size: 128, Cell: (({ cell }) => <span>{i18n.t(VoucherStatus[cell.getValue()])}</span>) },
        { accessorKey: 'creatorID', header: 'creatorID', size: 100 },
        { accessorKey: 'creatorCode', header: 'creatorCode', size: 128 },
        { accessorKey: 'creatorName', header: 'creatorName', size: 128 },
    ];
    // Translate header
    columns.map(column => {
        column.header = i18n.t(column.header);
        return column;
    });

    return columns;
}
// Report default hidden columns
export const defaultHideCol = () => {
    return {
        hid: false,
        bid: false,
        recipientID: false,
        recipientCode: false,
        ppeID: false,
        ppeCode: false,
        bStatus: false,
        issuingDeptID: false,
        issuingDeptCode: false,
        hDescription: false,
        hStatus: false,
        creatorID: false,
        creatorCode: false,
    };
};