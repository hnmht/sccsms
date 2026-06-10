import { cellGender,cellStatus,cellSystemFlag } from "../ScPub/PubFunction";
export const columns = [
    { id: "id", label: "id", alignment: "left", minWidth: 100, visible: false, sortField: "id", sort: true,  display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 100, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "mobile", label: "mobile", alignment: "center", minWidth: 60, visible: false, sortField: "mobile", sort: true, display: { type: 0, cell1: null } },
    { id: "email", label: "email", alignment: "center", minWidth: 60, visible: false, sortField: "email", sort: true, display: { type: 0, cell1: null } },
    { id: "deptID", label: "deptID", alignment: "center", minWidth: 30, visible: false, sortField: "deptID", sort: true, display: { type: 0, cell1: null } },
    { id: "deptCode", label: "deptCode", alignment: "center", minWidth: 30, visible: false, sortField: "deptCode", sort: true, display: { type: 0, cell1: null } },
    { id: "deptName", label: "deptName", alignment: "center", minWidth: 30, visible: true, sortField: "deptName", sort: true, display: { type: 0, cell1: null } },
    { id: "positionName", label: "positionName", alignment: "center", minWidth: 30, visible: true, sortField: "positionName", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 240, visible: false, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "gender", label: "gender", alignment: "center", minWidth: 60, visible: true, sort: false, sortField: "gender", display: { type: 1, cell1: cellGender } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: cellStatus } },
    { id: "systemFlag", label: "systemFlag", alignment: "center", minWidth: 60, visible: false, sortField: "systemFlag", sort: true, display: { type: 1, cell1: cellSystemFlag } },
];