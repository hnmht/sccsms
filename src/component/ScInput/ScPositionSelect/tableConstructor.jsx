import { cellStatus } from "../ScPub/PubFunction";

export const columns = [
    { id: "id", label: "id", alignment: "left", minWidth: 100, visible: false, sort: true, sortField: "id", display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "name", display: { type: 0, cell1: null } },
    { id: "description", label: "description", alignment: "center", minWidth: 240, visible: true, sort: true, sortField: "description", display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: cellStatus } },
];