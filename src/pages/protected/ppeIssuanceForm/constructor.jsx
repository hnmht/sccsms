import { DateTimeFormat, dayjs } from "../../../i18n/dayjs";
import store from "../../../store";
import {
    CellCreateTime,
    CellCreator,
    CellModifyTime,
    CellModifier,
    CellConfirmTime,
    CellConfirmer,
    CellVoucherStatus,
    CellBillDate,
    CellDept,
    CellPeriod
} from "../pub/pubFunction";
import { CellDescription } from "../pub/pubComponent";
// Is the row Copy Add Button enabled
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
// Is the row Unconfirm button enabled
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};

// Start Date Cell display content
const CellStartDate = (row, column) => {
    return DateTimeFormat(row.startDate,"LLL");
};
// End Date Cell display content
const CellEndDate = (row, column) => {
    return DateTimeFormat(row.endDate,"LLL");
};
// Is the Batch Delete button  enabled
export function delMultipleDisabled(selectedRows) {
    return false;
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
// Define PPE Issuance Form list columns
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "billNumber", alignment: "center", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "department", label: "department", alignment: "center", minWidth: 40, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "period", label: "period", alignment: "center", minWidth: 40, visible: true, sortField: "period", sort: true, display: { type: 1, cell1: CellPeriod } },
    { id: "startDate", label: "startDate", alignment: "center", minWidth: 30, visible: true, sortField: "starttime", sort: true, display: { type: 1, cell1: CellStartDate } },
    { id: "endDate", label: "endDate", alignment: "center", minWidth: 30, visible: true, sortField: "endtime", sort: true, display: { type: 1, cell1: CellEndDate } },
    { id: "sourceType", label: "sourceType", alignment: "center", minWidth: 50, visible: true, sortField: "sourceType", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];
// PPE Issuance Form query field definition
export const ldQueryFields = [
    { id: 1, value: "h.billdate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "h.billnumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "h.deptid", label: "deptID", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
];

// Generate PPE Issuance Form default query conditions
export function generatePPEIFConditions() {
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
            value: dayjs(new Date()).format("YYYYMMDD"),
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
}
// Default Header attachments
export const headFiles = {
    id: 0,
    billBID: 0,
    billHID: 0,
    file: { id: 0, hash: "" },
    dr: 0,
};

// Defualt body row attachments
const bodyFiles = {
    id: 0,
    billBID: 0,
    billHID: 0,
    file: { id: 0, hash: "" },
    dr: 0,
};

// Default body row
export const voucherRow = {
    id: 0,
    hid: 0,
    rowNumber: 10,
    recipient: { id: 0, code: "", name: "", avatar: { filekey: 0, fileUrl: "" }, deptid: 0, deptcode: "", description: "" },
    positionName: "",
    deptName: "",
    ppeCode: "",
    ppe: { id: 0, code: "", name: "", model: "", unit: "", description: "" },
    ppeModel: "",
    ppeUnit: "",
    quantity: 1.0,
    description: "",
    status: 0,
    files: [bodyFiles],
    dr: 0
};
export const bodyColumns = [
    { id: "action", label: "action", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "recipient", label: "recipient", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "student.name", sort: true, display: { type: 0, cell1: null } },
    { id: "positionName", label: "positionName", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: true, sortField: "positionName", sort: true, display: { type: 0, cell1: null } },
    { id: "deptName", label: "deptName", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "deptName", sort: true, display: { type: 0, cell1: null } },
    { id: "ppeCode", label: "ppeCode", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: true, sortField: "ppeCode", sort: true, display: { type: 0, cell1: null } },
    { id: "ppe", label: "ppeName", alignment: "left", width: 128, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "ppe.name", sort: true, display: { type: 0, cell1: null } },
    { id: "ppeModel", label: "ppeModel", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: true, sortField: "ppeModel", sort: true, display: { type: 0, cell1: null } },
    { id: "ppeUnit", label: "ppeUnit", alignment: "left", width: 64, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "ppeUnit", sort: true, display: { type: 0, cell1: null } },
    { id: "quantity", label: "quantity", alignment: "left", width: 128, maxWidth: 512, minWidth: 20, visible: true, allowNul: false, sortField: "examinescore", sort: true, display: { type: 0, cell1: null } },
    { id: "files", label: "files", alignment: "left", width: 96, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "files", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "left", width: 100, maxWidth: 120, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "left", width: 256, maxWidth: 256, minWidth: 20, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
];
