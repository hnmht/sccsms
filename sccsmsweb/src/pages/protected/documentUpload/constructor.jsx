import { DateTimeFormat } from "../../../i18n/dayjs";
import store from "../../../store";
import { CellCreator, CellCreateTime, CellModifyTime, CellModifier,CellDC } from "../pub/pubFunction";
import { CellDescription } from "../pub/pubComponent";

// Display ReleaseDate content
const CellReleaseDate = (row, column) => {
    return DateTimeFormat(row.releaseDate,"LLL");
};
// If the row copyAdd button enabled
const rowCopyAddDisabled = (row) => {
    return false;
};
// If the row Deltete button enabled
const rowDelDisabled = (row) => {
    const { user } = store.getState();
    return !(row.creator.id === user.id);

};
// If the row view button enabled
const rowViewDisabled = () => {
    return false;
};
// If the row Edit button enabled
const rowEditDisabled = (row) => {
    const { user } = store.getState();
    return !(row.creator.id === user.id);
};
// If the row Confirm button enabled
const rowStartDisabled = (row) => {
    return false;
};
// If the row Unconfirm button enabled
const rowStopDisabled = (row) => {
    return false;
};
// If the Batch Delete button enabled
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    }
    let allowDel = 0
    const { user } = store.getState();
    selectedRows.forEach(row => {
        if (row.creator.id !== user.id) {
            allowDel++
        }
    })
    return allowDel > 0;
}

// Define the row button 
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
        tips: "confirm",
        icon: "StartIcon",
    },
    rowStop: {
        visible: false,
        disabled: rowStopDisabled,
        color: "error",
        tips: "unconfirm",
        icon: "StopIcon",
    },
};
// Define Document table columns
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 120, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "edition", label: "edition", alignment: "center", minWidth: 60, visible: true, sortField: "edition", sort: true, display: { type: 0, cell1: null } },
    { id: "author", label: "author", alignment: "center", minWidth: 120, visible: true, sortField: "author", sort: true, display: { type: 0, cell1: null } },
    { id: "releaseDate", label: "releaseDate", alignment: "center", minWidth: 80, visible: true, sortField: "releaseDate", sort: true, display: { type: 1, cell1: CellReleaseDate } },
    { id: "description", label: "description", alignment: "center", minWidth: 120, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "dc", label: "dc", alignment: "center", minWidth: 60, visible: false, sortField: "dc.name", sort: true, display: { type: 1, cell1: CellDC } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];