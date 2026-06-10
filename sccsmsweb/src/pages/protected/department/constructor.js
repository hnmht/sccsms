import { CellCreator,CellCreateTime,CellModifyTime,CellModifier,CellStatus } from "../pub/pubFunction";
import { CellDescription ,CellName} from "../pub/pubComponent";

const rowCopyAddDisabled = (row) => {
    return row.systemFlag === 1;
}
const rowDelDisabled = (row) => {
    return row.systemFlag === 1  ;
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

// Display Department Head 
const CellLeader = (row, column) => {
    return row.leader.name;
};
// Display Parent Department
const CellDept = (row, column) => {    
    return row.fatherID.name;
};

// Define wether the batch delete button is disabled.
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    } else {
        let noDeleteRowNumber = 0;
        selectedRows.forEach((row) => {
            if (row.systemFlag > 0 ) {
                noDeleteRowNumber += 1
            }
        })
        return noDeleteRowNumber > 0 ;
    }
};

// Define Action button in table body 
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
    { id: "id", label: "ID", alignment: "left", minWidth: 60, visible: false,sortField:"id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 60, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 180, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },  
    { id: "description", label: "description", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "leader", label: "leader", alignment: "center", minWidth: 60, visible: true, sortField: "leader.name", sort: true, display: { type: 1, cell1: CellLeader } },
    { id: "fatherID", label: "fatherID", alignment: "center", minWidth: 60, visible: false, sortField: "fatherID.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 60, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 60, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];

