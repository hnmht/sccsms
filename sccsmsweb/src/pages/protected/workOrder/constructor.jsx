import { dayjs } from "../../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { GetCacheDocById } from "../../../storage/db/db";
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
    CellDept
} from "../pub/pubFunction";
import { CellDescription } from "../pub/pubComponent";

const rowCopyAddDisabled = (row) => {
    return false;
}
// Is the Row Delete button enabled
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};
// Is the Row View button enabled
const rowViewDisabled = () => {
    return false;
};
// Is the Row Edit button enabled
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 0 && row.creator.id === user.id);
};

// Is the start button enabled
const rowStartDisabled = (row) => {
    return !(row.status === 0);
};
// is the stop button enabled
const rowStopDisabled = (row) => {
    const { user } = store.getState();
    return !(row.status === 1 && row.confirmer.id === user.id);
};

// Is the Batch Delete button enabled
export function delMultipleDisabled(selectedRows) {
    const { user } = store.getState();
    let num = 0;
    if (selectedRows.length === 0) {
        return true;
    }
    selectedRows.forEach(wo => {
        if (wo.status !== 0 || wo.creator.id !== user.id) {
            num = num + 1;
        }
    })
    return num > 0;
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
// Table columns define
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "billNumber", label: "billNumber", alignment: "left", minWidth: 40, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: true, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "description", label: "description", alignment: "center", minWidth: 256, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "department", label: "department", alignment: "center", minWidth: 50, visible: true, sortField: "department.id", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "status", label: "status", alignment: "center", minWidth: 50, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
    { id: "confirmer", label: "confirmer", alignment: "center", minWidth: 30, visible: false, sortField: "confirmer.name", sort: true, display: { type: 1, cell1: CellConfirmer } },
    { id: "confirmDate", label: "confirmDate", alignment: "center", minWidth: 60, visible: false, sortField: "confirmDate", sort: true, display: { type: 1, cell1: CellConfirmTime } },
];
// Query the field definitions
export const QueryFields = [
    { id: 1, value: "workorder_h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
    { id: 2, value: "workorder_h.billNumber", label: "billNumber", inputType: 301, resultType: "string", resultfield: "" },
    { id: 3, value: "workorder_h.deptid", label: "department", inputType: 520, resultType: "object", resultfield: "id" },
    { id: 4, value: "workorder_h.status", label: "status", inputType: 405, resultType: "int", resultfield: "" },
    { id: 5, value: "department.name", label: "deptName", inputType: 301, resultType: "string", resultfield: "" },
    { id: 6, value: "department.code", label: "deptCode", inputType: 301, resultType: "string", resultfield: "" },
    { id: 7, value: "workorder_h.creatorid", label: "creator", inputType: 510, resultType: "object", resultfield: "id" },
];
// Default query conditions
export const generateConditions = () => [
    {
        logic: "and",
        field: { id: 1, value: "workorder_h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
        compare: { id: "greaterthanequal", label: 'greaterThanEqual', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
        value: dayjs().weekday(0).startOf("day"),
        isNecessary: true
    },
    {
        logic: "and",
        field: { id: 1, value: "workorder_h.billDate", label: "billDate", inputType: 306, resultType: "date", resultfield: "" },
        compare: { id: "lessthanequal", label: 'lessThanEqual', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number", "date", "dateTime"] },
        value: dayjs(new Date()).endOf("day"),
        isNecessary: true
    }
];

// Default Add row values
export const voucherRow = {
    id: 0,
    hid: 0,
    rowNumber: 10,
    csa: { id: 0, code: "", name: "", description: "" },
    executor: { id: 0, code: "", name: "" },
    description: "",
    ept: { id: 0, code: "", name: "" },
    startTime: dayjs(new Date()).startOf("day").add(9, "hour"),
    endTime: dayjs(new Date()).startOf("day").add(17, "hour"),
    status: 0,
    dr: 0
};

export const bodyColumns = [
    { id: "action", label: "action", alignment: "center", width: 80, maxWidth: 80, minWidth: 80, visible: true, allowNul: true, sortField: "action", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "left", width: 60, maxWidth: 60, minWidth: 60, visible: true, allowNul: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "csa", label: "csa", alignment: "left", width: 256, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "csa.name", sort: true, display: { type: 0, cell1: null } },
    { id: "executor", label: "executor", alignment: "left", width: 128, maxWidth: 256, minWidth: 80, visible: true, allowNul: false, sortField: "executor", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "ept", label: "ept", alignment: "left", width: 200, maxWidth: 512, minWidth: 80, visible: true, allowNul: false, sortField: "ept.name", sort: true, display: { type: 0, cell1: null } },
    { id: "startTime", label: "startTime", alignment: "left", width: 180, maxWidth: 256, minWidth: 20, visible: true, allowNul: false, sortField: "startTime", sort: true, display: { type: 0, cell1: null } },
    { id: "endTime", label: "endTime", alignment: "left", width: 180, maxWidth: 256, minWidth: 20, visible: true, allowNul: false, sortField: "endTime", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "left", width: 80, maxWidth: 128, minWidth: 20, visible: true, allowNul: true, sortField: "status", sort: true, display: { type: 0, cell1: null } },
];

// Convert the data to the backend format
export function transWOToBackend(wo) {
    const newWo = cloneDeep(wo);
    delete newWo.createDate;
    delete newWo.modifyDate;
    delete newWo.confirmDate;
    newWo.body.map((row) => {
        delete row.ept.body;
        return row;
    })
    return newWo;
}

// Convert the data to the front-end format
export const transWoDetailToFronted = async (woDetail) => {
    async function transBodyEit() {
        for (let row of woDetail.body) {
            let eptID = row.ept.id
            row.ept = await GetCacheDocById("ept", eptID);
        }
    }
    await transBodyEit();
    return woDetail;
};