import { dayjs, DateTimeFormat, CheckTimeZero } from "../../../../i18n/dayjs";
import store from "../../../../store";
import { i18n } from "../../../../i18n/i18n";
import { VoucherStatus } from "../../../../storage/dataTypes";

// Generate Work Order Report query condifiton fields
export const generateWOQueryFields = () => {
    const woQueryFields = [
        { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 2, value: "h.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 4, value: "b.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 5, value: "b.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 6, value: "b.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "b.eptid", label: "ept", inputType: 580, resultType: "object", resultfield: "id" }
    ];
    const options = store.getState().dynamicData.csos;
    let startid = 0;
    woQueryFields.forEach(field => {
        if (field.id > startid) {
            startid = field.id
        }
    });
    options.forEach((option) => {
        if (option.enable === 1) {
            startid++
            let field = {
                id: startid,
                value: "csa." + option.code,
                label: option.displayName,
                inputType: 550,
                resultType: "object",
                resultfield: "id",
                udc: option.udc
            }
            woQueryFields.push(field);
        }
    })

    return woQueryFields;
};

// Generate default query conditions
export function generateWODefaultCons() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).weekday(0),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 4, value: "b.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
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
        {
            accessorKey: 'woBillDate', header: 'billDate', size: 160,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "L")}</span>),
        },
        { accessorKey: 'woBillNumber', header: 'billNumber', size: 150 },
        { accessorKey: 'woRowNumber', header: 'rowNumber', size: 120 },
        { accessorKey: 'csaCode', header: 'csaCode', size: 180 },
        { accessorKey: "csaName", header: "csaName", size: 260 },
        { accessorKey: "respPersonCode", header: "respPersonCode", size: 120 },
        { accessorKey: "respPersonName", header: "respPersonName", size: 140 },
        { accessorKey: "respDeptCode", header: "respDeptCode", size: 140 },
        { accessorKey: "respDeptName", header: "respDeptName", size: 160 },
        { accessorKey: "executorCode", header: "executorCode", size: 120 },
        { accessorKey: "executorName", header: "executorName", size: 180 },
        { accessorKey: "eoCreatorName", header: "eoCreatorName", size: 200 },
        { accessorKey: "worDescription", header: "worDescription", size: 160 },
        { accessorKey: "eptCode", header: "eptCode", size: 120 },
        { accessorKey: "eptName", header: "eptName", size: 200 },
        {
            accessorKey: "woStartTime", header: "woStartTime", size: 180,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: "woEndTime", header: "woEndTime", size: 180,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: "eoStartTime", header: "eoStartTime", size: 180,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: "eoEndTime", header: "eoEndTime", size: 180,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: "worStatus", header: "worStatus", size: 120,
            Cell: (({ cell }) => <span>{i18n.t(VoucherStatus[cell.getValue()])}</span>)
        },
        { accessorKey: "woCreateDate", header: "createDate", size: 160 },
        { accessorKey: "woCreatorCode", header: "creatorCode", size: 100 },
        { accessorKey: "woCreatorName", header: "creatorName", size: 140 },
        { accessorKey: "woConfirmDate", header: "confirmDate", size: 180 },
        { accessorKey: "woConfirmerCode", header: "confirmerCode", size: 140 },
        { accessorKey: "woConfirmerName", header: "confirmerName", size: 140 },
        { accessorKey: "woDeptCode", header: "deptCode", size: 100 },
        { accessorKey: "woDeptName", header: "deptName", size: 120 },
        { accessorKey: "woDescription", header: "woHDescription", size: 260 },
        { accessorKey: "woStatus", header: "woStatus", size: 100 },
        { accessorKey: "woWorkDate", header: "woWorkDate", size: 120 },
        { accessorKey: "eoNumber", header: "eoNumber", size: 160 },
        { accessorKey: "eoCreatorCode", header: "eoCreatorCode", size: 140 },
        { accessorKey: "eoBillDate", header: "eoBillDate", size: 120 },
        {
            accessorKey: "eoHStatus", header: "eoHStatus", size: 140,
            Cell: (({ cell }) => <span>{i18n.t(VoucherStatus[cell.getValue()])}</span>)
        }
    ];

    // Translate header
    columns.map(column => {
        column.header = i18n.t(column.header);
        return column;
    });
    // Add Construction Site Option columns
    const options = store.getState().dynamicData.csos;
    options.forEach(option => {
        if (option.enable === 1) {
            let field = {
                accessorKey: option.code + "Name",
                header: option.displayName,
                size: 140,
            }
            columns.push(field);
        }
    })
    return columns;
};
// Report default hidden columns
export const columnVisibility = {
    csaCode: false,
    respPersonCode: false,
    respDeptCode: false,
    respPersonName: false,
    respDeptName: false,
    executorCode: false,
    woCreateDate: false,
    worDescription: false,
    woCreatorName: false,
    woCreatorCode: false,
    woConfirmerCode: false,
    woConfirmerName: false,
    woConfirmDate: false,
    woDeptCode: false,
    woDescription: false,
    woStatus: false,
    woWorkDate: false,
    eoCreatorCode: false,
    eptCode: false,
    eoBillDate: false,
    woDeptName: false
};