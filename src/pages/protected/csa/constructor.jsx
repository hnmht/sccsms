import { cloneDeep } from "lodash";
import { CellCreator, CellCreateTime, CellModifyTime, CellModifier, CellStatus } from "../pub/pubFunction";
import { CellDescription, CellName } from "../pub/pubComponent";

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
// Department display content
const CellDept = (row) => {
    return row.subDept.name
};
// Responsible Department display content 
const CellRespDept = (row) => {
    return row.respDept.name
};
// Responsible Person display content
const CellRespPerson = (row) => {
    return row.respPerson.name
};
// User-defined Column Display content
const CellUdf = (row, column) => {
    return row[column.id].name;
};
// Define wether the batch delete button is disabled
export function delMultipleDisabled(selectedRows) {
    return selectedRows.length === 0;
};

// Define a row button display content
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
    { id: "code", label: "code", alignment: "center", minWidth: 40, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 200, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },
    { id: "description", label: "description", alignment: "center", minWidth: 200, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 30, visible: false, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "subDept", label: "subDept", alignment: "center", minWidth: 30, visible: false, sortField: "subDept.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "respDept", label: "respDept", alignment: "center", minWidth: 30, visible: true, sortField: "respDept.name", sort: true, display: { type: 1, cell1: CellRespDept } },
    { id: "respPerson", label: "respPerson", alignment: "center", minWidth: 30, visible: true, sortField: "respPerson.name", sort: true, display: { type: 1, cell1: CellRespPerson } },
    { id: "endFlag", label: "endFlag", alignment: "center", minWidth: 30, visible: false, sortField: "endFlag", sort: true, display: { type: 0, cell1: null } },
    { id: "endDate", label: "endDate", alignment: "center", minWidth: 30, visible: false, sortField: "endDate", sort: true, display: { type: 0, cell1: null } },
    { id: "longitude", label: "longitude", alignment: "center", minWidth: 30, visible: false, sortField: "longitude", sort: true, display: { type: 0, cell1: null } },
    { id: "latitude", label: "latitude", alignment: "center", minWidth: 30, visible: false, sortField: "latitude", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 60, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 60, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];

export const GetDynamicColumns = (cols, options) => { 
    let newCols = cloneDeep(cols);  
    options.forEach((item) => {
        if (item.enable === 1) {
            let col = {
                id: item.code,
                label: item.displayName,
                alignment: "center",
                minWidth: 50,
                visible: true,
                sortField: item.code + ".name",
                sort: true,
                display: { type: 1, cell1: CellUdf }
            }
            newCols.push(col);
        }
    });   
    return newCols;
}
