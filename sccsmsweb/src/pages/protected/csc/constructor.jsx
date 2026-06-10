import { CellCreator, CellCreateTime, CellModifyTime, CellModifier, CellStatus } from "../pub/pubFunction";
import { CellDescription, CellName } from "../pub/pubComponent";

const rowCopyAddDisabled = (row) => {
    return false;
};
const rowDelDisabled = (row) => {
    return false;
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
// Parent category display content
const CellFather = (row, column) => {
    return row.fatherID.name;
};

// Define wether the batch delete button is disabled
export function delMultipleDisabled(selectedRows) {
    return selectedRows.length === 0;
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
        tips: "enable",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowStopDisabled,
        color: "error",
        tips: "disable",
        icon: "StopIcon",
    },
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 200, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },
    { id: "description", label: "description", alignment: "center", minWidth: 300, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "fatherID", label: "parentCategory", alignment: "center", minWidth: 100, visible: true, sortField: "fatherID.name", sort: true, display: { type: 1, cell1: CellFather } },
    { id: "status", label: "status", alignment: "center", minWidth: 30, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifierDate", label: "modifierDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifierDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];
