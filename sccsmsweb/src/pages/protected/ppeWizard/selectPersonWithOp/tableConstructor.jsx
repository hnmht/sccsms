import { CellGender,CellStatus ,CellSystemFlag} from "../../pub/pubFunction";
export const columns = [
    { id: "id", label: "id", alignment: "left", minWidth: 100, visible: false, sort: true, sortField: "id", display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "code", display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "name", display: { type: 0, cell1:null } },
    { id: "mobile", label: "mobile", alignment: "center", minWidth: 60, visible: false, sort: true, sortField: "mobile", display: { type: 0, cell1: null } },
    { id: "email", label: "email", alignment: "center", minWidth: 60, visible: false, sort: true, sortField: "email", display: { type: 0, cell1: null } },
    { id: "deptID", label: "deptID", alignment: "center", minWidth: 30, visible: false, sort: true, sortField: "deptID", display: { type: 0, cell1: null } },
    { id: "deptCode", label: "deptCode", alignment: "center", minWidth: 30, visible: false, sort: true, sortField: "deptCode", display: { type: 0, cell1: null } },
    { id: "deptName", label: "deptName", alignment: "center", minWidth: 30, visible: true, sort: true, sortField: "deptName", display: { type: 0, cell1: null } },
    { id: "positionName", label: "positionName", alignment: "center", minWidth: 30, visible: true, sort: true, sortField: "positionName", display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 240, visible: false, sort: true, sortField: "description", display: { type: 0, cell1: null } },
    { id: "gender", label: "gender", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "gender", display: { type: 1, cell1: CellGender } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: CellStatus } },
    { id: "systemFlag", label: "systemFlag", alignment: "center", minWidth: 60, visible: false, sort: true, sortField: "systemFlag", display: { type: 1, cell1: CellSystemFlag } },
];

// Convert Postions to position ID Array
export const convertPositionsToIDs = (positions) => {
    let ids = [];
    positions.forEach((position) => {
        ids.push(position.id);
    });
    return ids;
}

