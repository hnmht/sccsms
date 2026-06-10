import { CellCreator, CellCreateTime, CellModifyTime, CellModifier,CellSystemFlag } from "../pub/pubFunction";

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

// Determine if the batch delete button is avaliable
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((rows) => {
            if (( rows.systemFlag) > 0) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ? true : false;
    }    
}
// Determine the row action button
export const rowActionsDefine = {
    rowCopyAdd:{
        visible: true,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "copyAdd",
        icon: "CopyNewIcon",
    },
    rowViewDetail:{
        visible: true,
        disabled: rowViewDisabled,
        color: "secondary", 
        tips: "detail",
        icon: "DetailIcon", 
    },
    rowEdit:{
        visible: true,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete:{
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
// Determine the person list column
export const columns = [
    { id: "id", label: "id", alignment: "left", minWidth: 100, visible: false,sortField:"id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 200, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 360, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "systemFlag", label: "systemFlag", alignment: "center", minWidth: 60, visible: true, sortField: "systemFlag", sort: true, display: { type: 1, cell1: CellSystemFlag } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 60, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 60, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];
