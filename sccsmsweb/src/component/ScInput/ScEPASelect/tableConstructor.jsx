import {
    Typography
} from "@mui/material";
import { cellStatus } from "../ScPub/PubFunction";
import { CellDescription } from "../ScPub/PubComponent";

// The EPC Cell display content
const CellEPCName = (row) => {
    return row.epc.name;
};
// The ResultTyep Cell display content
const CellResultType = (row) => {
    return row.resultType.name;
};
// The isCheckError Cell display content
const CellIsCheckError = (row) => {
    return row.isCheckError === 0 ? "N" : "Y";
};

// The Risk Level Cell display content
const CellRiskLevel = (row, column) => {
    return (<div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.riskLevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.riskLevel.name}</Typography>
    </div>);
};

// The UDC Cell display content
const CellUDCName = (row) => {
    return row.udc.name;
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 30, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 60, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 60, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "riskLevel", label: "riskLevel", alignment: "center", minWidth: 60, visible: true, sortField: "riskLevel.name", sort: true, display: { type: 1, cell1: CellRiskLevel } },
    { id: "description", label: "description", alignment: "center", minWidth: 160, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: cellStatus } },
    { id: "epc", label: "epc", alignment: "center", minWidth: 60, visible: false, sortField: "itemclass.name", sort: true, display: { type: 1, cell1: CellEPCName } },
    { id: "resultType", label: "resultType", alignment: "center", minWidth: 60, visible: true, sortField: "resultType.name", sort: true, display: { type: 1, cell1: CellResultType } },
    { id: "udc", label: "udc", alignment: "center", minWidth: 60, visible: false, sortField: "udc.name", sort: true, display: { type: 1, cell1: CellUDCName } },
    { id: "defaultValueDisp", label: "defaultValueDisp", alignment: "center", minWidth: 60, visible: false, sortField: "defaultValueDisp", sort: true, display: { type: 0, cell1: null } },
    { id: "isCheckError", label: "isCheckError", alignment: "center", minWidth: 60, visible: true, sortField: "isCheckError", sort: true, display: { type: 1, cell1: CellIsCheckError } },
    { id: "errorValueDisp", label: "errorValueDisp", alignment: "center", minWidth: 30, visible: true, sortField: "errorValueDisp", sort: true, display: { type: 0, cell1: null } }
];