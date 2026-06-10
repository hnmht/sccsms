import {
    Typography,
} from "@mui/material";
import { CellCreator, CellCreateTime, CellModifyTime, CellModifier, CellStatus } from "../pub/pubFunction";
import { CellDescription,CellName } from "../pub/pubComponent";
import { i18n } from "../../../i18n/i18n";


// Execution Projcet Category display content
const CellEPCName = (row) => {
    return row.epc.name;
};

// ResultType display content
const CellResultType = (row) => {
    return i18n.t(row.resultType.name);
};
// isCheckError display content
const CellIsCheckError = (row) => {
    return row.isCheckError === 0 ? "N" : "Y";
};

// UDC name display content
const CellUDCName = (row) => {
    return row.udc.name;
};


// Risk Level display content
const CellRiskLevel = (row, column) => {
    return (<div style={{ height:30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.riskLevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.riskLevel.name}</Typography>
    </div>);
};

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

// Define wether the batch delete button is disabled
export function delMultipleDisabled(selectedRows) {
    if (selectedRows.length === 0) {
        return true;
    }
    return false;
}

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
    { id: "id", label: "ID", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 60, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 192, visible: true, sortField: "name", sort: true, display: { type: 1, cell1: CellName } },
    { id: "description", label: "description", alignment: "center", minWidth: 160, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: CellStatus } },
    { id: "epc", label: "epc", alignment: "center", minWidth: 60, visible: false, sortField: "epc.name", sort: true, display: { type: 1, cell1: CellEPCName } },
    { id: "resultType", label: "resultType", alignment: "center", minWidth: 60, visible: true, sortField: "resultType.name", sort: true, display: { type: 1, cell1: CellResultType } },
    { id: "udc", label: "udc", alignment: "center", minWidth: 60, visible: false, sortField: "udc.name", sort: true, display: { type: 1, cell1: CellUDCName } },
    { id: "defaultValueDisp", label: "defaultValueDisp", alignment: "center", minWidth: 60, visible: true, sortField: "defaultValueDisp", sort: true, display: { type: 0, cell1: null } },
    { id: "isCheckError", label: "isCheckError", alignment: "center", minWidth: 60, visible: true, sortField: "isCheckError", sort: true, display: { type: 1, cell1: CellIsCheckError } },
    { id: "errorValueDisp", label: "errorValueDisp", alignment: "center", minWidth: 30, visible: true, sortField: "errorValueDisp", sort: true, display: { type: 0, cell1: null } },
    { id: "riskLevel", label: "riskLevel", alignment: "center", minWidth: 60, visible: true, sortField: "riskLevel.name", sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: CellCreateTime } },
    { id: "modifier", label: "modifier", alignment: "center", minWidth: 60, visible: false, sortField: "modifier.name", sort: true, display: { type: 1, cell1: CellModifier } },
    { id: "modifyDate", label: "modifyDate", alignment: "center", minWidth: 60, visible: false, sortField: "modifyDate", sort: true, display: { type: 1, cell1: CellModifyTime } },
];