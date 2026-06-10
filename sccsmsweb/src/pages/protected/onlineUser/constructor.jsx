import { UnixTimeFormat } from "../../../i18n/dayjs";
import { CellDept } from "../pub/pubFunction";

const clientType = new Map([
    ["sceneweb","browser"],
    ["scenemob","mobileDevice"]
]);

const rowCopyAddDisabled = (row) => {
    return row.systemflag === 1;
}
const rowDelDisabled = (row) => {
    return row.systemflag === 1;
};

const rowViewDisabled = () => {
    return false;
};

const rowEditDisabled = (row) => {
    return row.systemflag === 1;
};

const rowStartDisabled = (row) => {
    return false;
};

const rowStopDisabled = (row) => {
    return false;
};

// User code display
const CellUserCode = (row,column) => {
    return row.user.code;
};
// User name display
const CellUserName = (row,column) => {
    return row.user.name
};
// Client type display
const CellClientType = (row, column) => {
    return clientType.get(row.clientType);
};
// Expire time display
const CellExpireTime = (row, column) => {
    return UnixTimeFormat(row.expireTime,"LLL");
};
// Define whether the batch delete button is diabled.
export function delMultipleDisabled(selectedRows) {    
    return true;
}

export const rowActionsDefine = {
    rowCopyAdd: {
        visible: false,
        disabled: rowCopyAddDisabled,
        color: "success",
        tips: "addCopy",
        icon: "CopyNewIcon",
    },
    rowViewDetail: {
        visible: false,
        disabled: rowViewDisabled,
        color: "secondary",
        tips: "view",
        icon: "DetailIcon",
    },
    rowEdit: {
        visible: false,
        disabled: rowEditDisabled,
        color: "warning",
        tips: "edit",
        icon: "EditIcon",
    },
    rowDelete: {
        visible: true,
        disabled: rowDelDisabled,
        color: "error",
        tips: "destoryLoginCredential",
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
    { id: "id", label: "id", alignment: "center", minWidth: 160, visible: true, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "clientType", label: "clientType", alignment: "center", minWidth: 160, visible: true, sortField: "clientType", sort: true, display: { type: 1, cell1: CellClientType } },
    { id: "fromIp", label: "fromIp", alignment: "center", minWidth: 160, visible: true, sortField: "fromIp", sort: true, display: { type: 0, cell1: null } },
    { id: "user.code", label: "userCode", alignment: "center", minWidth: 100, visible: true, sortField: "user.code", sort: true, display: { type: 1, cell1: CellUserCode } },
    { id: "user.name", label: "userName", alignment: "center", minWidth: 160, visible: true, sortField: "user.name", sort: true, display: { type: 1, cell1: CellUserName } },
    { id: "department", label: "department", alignment: "center", minWidth: 60, visible: false, sortField: "user.department.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "expireTime", label: "expireTime", alignment: "center", minWidth: 160, visible: true, sortField: "expireTime", sort: true, display: { type: 1, cell1: CellExpireTime } },       
];

