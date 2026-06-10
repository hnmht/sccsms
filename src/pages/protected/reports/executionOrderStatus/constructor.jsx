import { DateTimeFormat, dayjs, CheckTimeZero } from "../../../../i18n/dayjs";
import store from "../../../../store";
import { i18n } from "../../../../i18n/i18n";
import { VoucherStatus } from "../../../../storage/dataTypes";

const yesOrNo = ["", "Y"];
// Generate Execution Order Report query condition fields
export const generateEOQueryFields = () => {
    const edQueryFields = [
        { id: 1, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
        { id: 2, value: "h.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 5, value: "h.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 6, value: "b.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 7, value: "h.eptid", label: "ept", inputType: 580, resultType: "object", resultfield: "id" },
        { id: 8, value: "b.epaid", label: "epa", inputType: 560, resultType: "object", resultfield: "id" },
        { id: 9, value: "b.isissue", label: "isIssue", inputType: 404, resultType: "int", resultfield: "" },
        { id: 10, value: "b.isrectify", label: "isRectify", inputType: 404, resultType: "int", resultfield: "" },
        { id: 11, value: "b.ishandle", label: "isHandle", inputType: 404, resultType: "int", resultfield: "" },
        { id: 12, value: "b.isfinish", label: "isFinish", inputType: 404, resultType: "int", resultfield: "" },
    ];
    const options = store.getState().dynamicData.csos;
    let startid = 0;
    edQueryFields.forEach(field => {
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
            edQueryFields.push(field);
        }
    })

    return edQueryFields;
};

// Generate EO default query conditions
export function generateEODefaultCons() {
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
            value: dayjs(new Date()),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 4, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
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
        { accessorKey: 'billNumber', header: 'billNumber', size: 160 },
        {
            accessorKey: "billDate", header: "billDate", size: 140,
            Cell: (({ cell }) => <span>{DateTimeFormat(cell.getValue(), "L")}</span>)
        },
        { accessorKey: 'hDeptCode', header: 'deptCode', size: 160 },
        { accessorKey: 'hDeptName', header: 'deptName', size: 160 },
        { accessorKey: 'hDescription', header: 'hDescription', size: 160 },
        { accessorKey: 'hStatus', header: 'hStatus', size: 160, Cell: (({ cell }) => <span>{i18n.t(VoucherStatus[cell.getValue()])}</span>) },
        { accessorKey: 'sourceType', header: 'sourceType', size: 160 },
        { accessorKey: 'sourceBillNumber', header: 'sourceBillNumber', size: 160 },
        { accessorKey: 'sourceRowNumber', header: 'sourceRowNumber', size: 140 },
        {
            accessorKey: 'hStartTime', header: 'startTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: 'hEndTime', header: 'endTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        { accessorKey: 'csaCode', header: 'csaCode', size: 200 },
        { accessorKey: 'csaName', header: 'csaName', size: 260 },
        { accessorKey: 'csaID', header: 'csaID', size: 60 },
        { accessorKey: 'executorCode', header: 'executorCode', size: 160 },
        { accessorKey: 'executorName', header: 'executorName', size: 160 },
        { accessorKey: 'eptCode', header: 'eptCode', size: 160 },
        { accessorKey: 'eptName', header: 'ept', size: 200 },
        { accessorKey: "rowNumber", header: "rowNumber", size: 100 },
        { accessorKey: 'epaCode', header: 'epaCode', size: 260 },
        { accessorKey: 'epaName', header: 'epaName', size: 320 },
        {
            accessorKey: 'rlName', header: 'rlName', size: 140,
            Cell: (({ cell }) => {
                return (<span style={{ maxHeight: 32, minWidth: 100, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: cell.row.original.rlColor }}>
                    {cell.getValue()}
                </span>)
            })
        },
        { accessorKey: 'executionValueDisp', header: 'executionValueDisp', size: 160 },
        { accessorKey: 'bDescription', header: 'bDescription', size: 200 },
        { accessorKey: 'isCheckError', header: 'isCheckError', size: 100, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isRequireFile', header: 'isRequireFile', size: 100, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isOnSitePhoto', header: 'isOnSitePhoto', size: 100, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isIssue', header: 'isIssue', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isRectify', header: 'isRectify', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'isHandle', header: 'isHandle', size: 140, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'issueOwnerCode', header: 'issueOwnerCode', size: 160 },
        { accessorKey: 'issueOwnerName', header: 'issueOwnerName', size: 140 },
        {
            accessorKey: 'handleStartTime', header: 'handleStartTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        {
            accessorKey: 'handleEndTime', header: 'handleEndTime', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        { accessorKey: 'bStatus', header: 'bStatus', size: 160, Cell: (({ cell }) => <span>{i18n.t(VoucherStatus[cell.getValue()])}</span>) },
        { accessorKey: 'isFinish', header: 'isFinish', size: 160, Cell: (({ cell }) => <span>{yesOrNo[cell.getValue()]}</span>) },
        { accessorKey: 'irfNumber', header: 'irfNumber', size: 160 },
        {
            accessorKey: 'createDate', header: 'createDate', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        { accessorKey: 'creatorCode', header: 'creatorCode', size: 160 },
        { accessorKey: 'creatorName', header: 'creatorName', size: 160 },
        {
            accessorKey: 'confirmDate', header: 'confirmDate', size: 160,
            Cell: (({ cell }) => <span>{CheckTimeZero(cell.getValue()) ? "" : DateTimeFormat(cell.getValue(), "LLL")}</span>)
        },
        { accessorKey: 'confirmerCode', header: 'confirmerCode', size: 160 },
        { accessorKey: 'confirmerName', header: 'confirmerName', size: 160 }
    ];

    // Translate header
    columns.map(column => {
        column.header = i18n.t(column.header);
        return column;
    });
    // Add CSA option columns
    const options = store.getState().dynamicData.csos;
    console.log("options:", options);
    options.forEach(option => {
        if (option.enable === 1) {
            let field = {
                accessorKey: option.code + "Name",
                header: option.displayName,
                size: 140,
            }
            columns.push(field);
        }
    });
    return columns;
}
// Report default hidden columns
export const defaultHideCol = () => {
    return {
        hDeptCode: false,
        hStartTime: false,
        hEndTime: false,
        hDeptName: false,
        hDescription: false,
        hStatus: false,
        sourceType: false,
        csaCode: false,
        csaID: false,
        executorCode: false,
        eptCode: false,
        eptName: false,
        epaCode: false,
        bDescription: false,
        isCheckError: false,
        isRequireFile: false,
        isOnSitePhoto: false,
        issueOwnerCode: false,
        createDate: false,
        creatorCode: false,
        confirmDate: false,
        eoCreatorCode: false,
        confirmerCode: false,
        sourceBillNumber: false,
        sourceRowNumber: false,
    }
};