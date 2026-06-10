import { 
    CellCreator,  
    CellVoucherStatus,
    CellCSA,
    CellEPT,
    CellExecutor,
    CellDept,
    CellBillDate,
    CellTime
 } from "../../pub/pubFunction";

// Define Work Order list columns
export const columns = [
    { id: "id", label: "BID", alignment: "left", minWidth: 10, visible: false, sortField:"id", sort: true, display: { type: 0, cell1: null } },
    { id: "hid", label: "HID", alignment: "center", minWidth: 20, visible: false, sortField: "hid", sort: true, display: { type: 0, cell1: null } },
    { id: "billDate", label: "billDate", alignment: "center", minWidth: 30, visible: false, sortField: "billDate", sort: true, display: { type: 1, cell1: CellBillDate } },
    { id: "billNumber", label: "billNumber", alignment: "center", minWidth: 30, visible: true, sortField: "billNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "rowNumber", label: "rowNumber", alignment: "center", minWidth: 30, visible: true, sortField: "rowNumber", sort: true, display: { type: 0, cell1: null } },
    { id: "csa", label: "csa", alignment: "center", minWidth: 60, visible: true, sortField: "csa.name", sort: true, display: { type: 1, cell1: CellCSA } },
    { id: "ept", label: "ept", alignment: "center", minWidth: 60, visible: true, sortField: "ept.name", sort: true, display: { type: 1, cell1: CellEPT } },
    { id: "executor", label: "executor", alignment: "center", minWidth: 60, visible: true, sortField: "executor.name", sort: true, display: { type: 1, cell1: CellExecutor } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "startTime", label: "startTime", alignment: "center", minWidth: 30, visible: true, sortField: "startTime", sort: true, display: { type: 1, cell1: CellTime } },
    { id: "endTime", label: "endTime", alignment: "center", minWidth: 30, visible: true, sortField: "endTime", sort: true, display: { type: 1, cell1: CellTime } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: false, sortField: "id", sort: true, display: { type: 1, cell1: CellVoucherStatus } },
    { id: "department", label: "department", alignment: "center", minWidth: 60, visible: false, sortField: "status", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "headerDescription", label: "headerDescription", alignment: "center", minWidth: 160, visible: false, sortField: "headerDescription", sort: true, display: { type: 0, cell1: null } },
    { id: "workDate", label: "workDate", alignment: "center", minWidth: 30, visible: false, sortField: "workDate", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 60, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: CellCreator} },   
];
