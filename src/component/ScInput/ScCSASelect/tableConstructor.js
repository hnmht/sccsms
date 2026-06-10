import { cloneDeep } from "lodash";
import { CellDescription } from "../ScPub/PubComponent";
import { cellStatus,cellCreator,cellCreateDate } from "../ScPub/PubFunction";

// Diaplsy subDept cell content
const CellDept = (row) => {
    return row.subDept.name
};
// Display Response Department cell content
const CellRespDept = (row) => {
    return row.respDept.name
};
// Diaplay Response Person cell content
const CellRespPerson = (row) => {
    return row.respPerson.name
};
// Diaplsy User-defined cell content
const CellUdf = (row, column) => {
    return row[column.id].name;
};
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "center", minWidth: 40, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 60, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 100, visible: false, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "status", label: "status", alignment: "center", minWidth: 30, visible: false, sortField: "status", sort: true, display: { type: 1, cell1: cellStatus } },
    { id: "subDept", label: "subDept", alignment: "center", minWidth: 30, visible: false, sortField: "subDept.name", sort: true, display: { type: 1, cell1: CellDept } },
    { id: "respDept", label: "respDept", alignment: "center", minWidth: 30, visible: true, sortField: "respDept.name", sort: true, display: { type: 1, cell1: CellRespDept } },
    { id: "respPerson", label: "respPerson", alignment: "center", minWidth: 30, visible: true, sortField: "respPerson.name", sort: true, display: { type: 1, cell1: CellRespPerson } },
    { id: "endFlag", label: "endFlag", alignment: "center", minWidth: 30, visible: false, sortField: "finishflag", sort: true, display: { type: 0, cell1: null } },
    { id: "endDate", label: "endDate", alignment: "center", minWidth: 30, visible: false, sortField: "endDate", sort: true, display: { type: 0, cell1: null } },
    { id: "longitude", label: "longitude", alignment: "center", minWidth: 30, visible: false, sortField: "longitude", sort: true, display: { type: 0, cell1: null } },
    { id: "latitude", label: "latitude", alignment: "center", minWidth: 30, visible: false, sortField: "latitude", sort: true, display: { type: 0, cell1: null } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 60, visible: false, sortField: "creator.name", sort: true, display: { type: 1, cell1: cellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 60, visible: false, sortField: "createDate", sort: true, display: { type: 1, cell1: cellCreateDate } },
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
};
