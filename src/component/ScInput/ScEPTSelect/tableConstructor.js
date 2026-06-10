import { cellCreator,cellStatus,cellCreateDate } from "../ScPub/PubFunction";
// Define column
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "code", label: "code", alignment: "left", minWidth: 40, visible: true, sortField: "code", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "center", minWidth: 30, visible: true, sortField: "status", sort: true, display: { type: 1, cell1: cellStatus } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: cellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: cellCreateDate } },
];
