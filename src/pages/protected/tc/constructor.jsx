import { CellCreateTime, CellCreator, CellModifyTime, CellModifier,CellStatus } from "../pub/pubFunction";
import { CellDescription } from "../pub/pubComponent";

const rowCopyAddDisabled = (row) => {
    return false;
};
const rowDelDisabled = (row) => {
    return row.useddoc > 0;
};
const rowViewDisabled = () => {
    return false;
};
const rowEditDisabled = (row) => {
    return false;
};
const rowStartDisabled = (row) => {
    return false;
};
const rowStopDisabled = (row) => {
    return false;
};
// Display for isExamine field
const CellIsExamine = (row) => {
    return row.isExamine === 0 ? "N" : "Y";
};
// Define if multiple delete button should be disabled
export function delMultipleDisabled(selectedRows) { 
    return selectedRows.length === 0 ;
};

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
        visible: false,
        disabled: rowStartDisabled,
        color: "success",
        tips: "start",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowStopDisabled,
        color: "error",
        tips: "stop",
        icon: "StopIcon",
    },
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField:"id",sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "classHour", label: "classHour", alignment: "center", minWidth: 100, visible: true, sortField: "classHour", sort: true, display: { type: 0, cell1: null } },
    { id: "isExamine", label: "isExamine", alignment: "center", minWidth: 30, visible: true, sortField: "isExamine", sort: true, display: { type: 1, cell1: CellIsExamine } },
    { id: "description", label: "description", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 20, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 30, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];
