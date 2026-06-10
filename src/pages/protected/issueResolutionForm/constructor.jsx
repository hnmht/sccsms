import store from "../../../store";
import { dayjs } from "../../../i18n/dayjs";
import {
    CellCreateTime,
    CellCreator,
    CellModifyTime,
    CellModifier,
    CellConfirmTime,
    CellConfirmer,
    CellVoucherStatus,
    CellCSA,
    CellExecutor,
    CellBillDate,
    CellDept,
    CellIssueOwner,
    CellHandler
} from "../pub/pubFunction";
import { CellDescription,CellRiskLevel } from "../pub/pubComponent";

// Is the Row CopyAdd button enabled
const rowCopyAddDisabled = (row) => {
    return false;
};
// Is the row Delete button enabled
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the row View button enabled
const rowViewDisabled = () => {
    return false;
};
// Is the row Edit button enabled
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the row Confirm button enabled
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};
// Is the row UnConfirm button enabled
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};

// Define row button
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "copyAdd",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: true,
        disabled: rowViewDisabled,
        color: "secondary",
        tips: "detail",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: true,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: rowDelDisabled,
        color: "error",
        tips: "delete",
        icon: "DeleteIcon",
    },
    rowStart: {
        visible: true,
        disabled: rowStartDisabled,
        color: "success",
        tips: "confirm",
        icon: "StartIcon",
    },
    rowStop: {
        visible: true,
        disabled: rowStopDisabled,
        color: "error",
        tips: "unconfirm",
        icon: "CancelConfirmIcon",
    },
};
// Define Issue Resolution Form table columns
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "billNumber", alignment: "center", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "csa", label: "csa", alignment: "center", minWidth: 50, visible: true, sortField: "csa", sort: true, display: { type: 1, cell1: CellCSA } },
    { id: "riskLevel", label: "riskLevel", alignment: "center", minWidth: 50, visible: true, sortField: "riskLevel.name", sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "executor", label: "executor", alignment: "center", minWidth: 30, visible: false, sortField: "executor", sort: true, display: { type: 1, cell1: CellExecutor } },
    { id: "issueOwner", label: "issueOwner", alignment: "center", minWidth: 30, visible: true, sortField: "issueOwner", sort: true, display: { type: 1, cell1: CellIssueOwner } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "department", alignment: "center", minWidth: 40, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "handler", label: "handler", alignment: "center", minWidth: 30, visible: true, sortField: "handler", sort: true, display: { type: 1, cell1: CellHandler } },
    { id: "sourceBillNumber", label: "sourceBillNumber", alignment: "center", minWidth: 40, visible: true, sortField: "sourceBillNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "sourceRowNumber", label: "sourceRowNumber", alignment: "center", minWidth: 40, visible: false, sortField: "sourceRowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

// Execution Order Query fileds definition
export const eoQueryFields = [
    { id: 1, value: "b.handleStartTime", label: "handleStartTime", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "b.epaid", label: "epa", inputType: 560, resultType: "object", resultfield: "id" },
    { id: 3, value: "h.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 5, value: "h.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 7, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 8, value: "b.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
];

// Generate Execution Order default conditions
export function generateEOConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "b.handleStartTime", label: "handleStartTime", inputType: 307, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date","object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "b.handleStartTime", label: "handleStartTime", inputType: 307, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value:dayjs(new Date()).endOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 7, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}

// Issue Resolution Form fileds definition
export const irfQueryFields = [
    { id: 1, value: "b.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "b.epaid", label: "epa", inputType: 560, resultType: "object", resultfield: "id" },
    { id: 3, value: "b.csaid", label: "csa", inputType: 570, resultType: "object", resultfield: "id" },
    { id: 4, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 5, value: "b.startTime", label: "startTime", inputType: 307, resultType: "string", resultfield: "" },
    { id: 6, value: "b.endTime", label: "endTime", inputType: 307, resultType: "date", resultfield: "" },
    { id: 7, value: "b.billNumber", label: "billNumber", inputType: 301, resultType: "date", resultfield: "" },
    { id: 8, value: "b.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 9, value: "b.executorid", label: "executor", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 10, value: "b.sourceBillNumber", label: "sourceBillNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 11, value: "b.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
];

// Generate Issue Resolution Form default condition
export function generateIRFConditions() {
    const { user } = store.getState();
    const currentPerson = user.person;
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "b.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["date","object", "string", "int", "number"] },
            value: dayjs().weekday(0).startOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "b.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
            compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: dayjs(new Date()).endOf("day"),
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 4, value: "b.issueownerid", label: "issueOwner", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["date", "object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ];
    return conditions;
}