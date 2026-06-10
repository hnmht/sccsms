import {
    CellCreator,
    CellCreateTime,
    CellModifyTime,
    CellModifier,
    CellStatus,
    CellDept,
    CellGender,
    CellPosition,
    CellSystemFlag
} from "../pub/pubFunction";
import { CellDescription } from "../pub/pubComponent";

const rowCopyAddDisabled = (row) => {
    return row.systemFlag === 1;
}
const rowDelDisabled = (row) => {
    return row.systemFlag === 1;
};

const rowViewDisabled = () => {
    return false;
};

const rowEditDisabled = (row) => {
    return row.systemFlag === 1;
};

const rowStartDisabled = (row) => {
    return false;
};

const rowStopDisabled = (row) => {
    return false;
};

// Is operator
const CellIsOperator = (row) => {
    return row.isOperator === 1 ? "Y" : "N";
};

// Is the batch delete button disible
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((row) => {
            if (row.systemFlag > 0) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ? true : false;
    }
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
    { id: "id", label: "id", alignment: "left", minWidth: 100, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 100, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 160, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "mobile", label: "mobile", alignment: "center", minWidth: 60, visible: true, sortField: "mobile", sort: true, display: { type: 0, cell1: null } },
    { id: "email", label: "email", alignment: "center", minWidth: 60, visible: true, sortField: "email", sort: true, display: { type: 0, cell1: null } },
    { id: "isOperator", label: "isOperator", alignment: "center", minWidth: 60, visible: true, sortField: "isOperator", sort: true, display: { type: 1, cell1: CellIsOperator } },
    { id: "position", label: "position", alignment: "center", minWidth: 60, visible: true, sortField: "position.name", sort: true, display: { type: 1, cell1: CellPosition } },
    { id: "department", label: "department", alignment: "center", minWidth: 60, visible: true, sortField: "department.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "description", label: "description", alignment: "center", minWidth: 240, visible: false, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "gender", label: "gender", alignment: "center", minWidth: 60, visible: true, sortField: "gender", sort: true, display: { type: 1, cell1: CellGender } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "systemFlag", label: "systemFlag", alignment: "center", minWidth: 60, visible: true, sortField: "systemFlag", sort: true, display: { type: 1, cell1: CellSystemFlag } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 60, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 60, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];

