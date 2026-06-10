import { cellStatus } from "../ScPub/PubFunction";

// The content displayed in the Color cell
const CellColor = (row, column) => {
    return (<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
        <div style={{ minHeight: 16, width: 32, borderRadius: 4, backgroundColor: row.color }} />
    </div>)
};
export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 100, visible: false, sort: true, sortField: "id", display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "name", display: { type: 0, cell1: null } },
    { id: "color", label: "color", alignment: "center", minWidth: 100, visible: true, sort: true, sortField: "color", display: { type: 1, cell1: CellColor } },
    { id: "description", label: "description", alignment: "center", minWidth: 240, visible: true, sort: true, sortField: "description", display: { type: 0, cell1: null } },
    { id: "status", label: "status", alignment: "center", minWidth: 60, visible: true, sort: true, sortField: "status", display: { type: 1, cell1: cellStatus } },
];