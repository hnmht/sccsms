import store from "../../../store";
import {
    CellCreateTime,
    CellCreator,
    CellModifyTime,
    CellModifier,
    CellConfirmTime,
    CellConfirmer,
    CellVoucherStatus,
    CellPosition,
    CellPeriod
} from "../pub/pubFunction";
import { CellDescription } from "../pub/pubComponent";
// Is the row Copy Add button enabled
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

// Define row button
export const rowActionsDefine = {
    rowCopyAdd: {
        visible: true,
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
// Define PPE Quota List table column
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "position", label: "position", alignment: "center", minWidth: 50, visible: true, sortField: "position.name", sort: true, display: { type: 1, cell1: CellPosition } },
    { id: "period", label: "period", alignment: "center", minWidth: 100, visible: true, sortField: "period", sort: true, display: { type: 1, cell1: CellPeriod } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];

// PPE Quota query fields definition
export const QueryFields = [
    { id: 1, value: "h.positionid", label: "position", inputType: 610, resultType: "object", resultfield: "id" },
    { id: 2, value: "h.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
    { id: 3, value: "h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
    { id: 4, value: "h.period", label: "period", inputType: 407, resultType: "string", resultfield: "" },

];
// Generate PPE Quota default query conditions
export const generateConditions = () => {
    const { user } = store.getState();
    const currentPerson = user.person;
    return [
        {
            logic: "and",
            field: { id: 3, value: "h.creatorid", label: "creatorID", inputType: 510, resultType: "object", resultfield: "id" },
            compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: currentPerson,
            isNecessary: false
        }
    ]
};

// Default body row
export const voucherRow = {
    id: 0,
    hid: 0,
    rowNumber: 10,
    ppe: { id: 0, code: "", name: "", model: "", unit: "", description: "" },
    quantity: 0,
    description: "",
    status: 0,
    dr: 0
};

export const bodyColumns = [
    { id: "action", label: "action", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "ppe", label: "ppe", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "ppe.name", sort: true, display: { type: 0, cell1: null } },
    { id: "unit", label: "unit", alignment: "left", width: 64, maxWidth: 256, minWidth: 80, visible: true, allowNul: true, sortField: "ppe.unit", sort: true, display: { type: 0, cell1: null } },
    { id: "quantity", label: "quantity", alignment: "left", width: 128, maxWidth: 256, minWidth: 60, visible: true, allowNul: false, sortField: "quantity", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "left", width: 80, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
];

