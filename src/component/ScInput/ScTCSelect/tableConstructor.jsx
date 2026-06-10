
import { cellCreateDate,cellCreator } from "../ScPub/PubFunction";
import { CellDescription } from "../ScPub/PubComponent";

// Content displayed in the isExamine cell
const CellIsExamine = (row) => {
    return row.isExamine === 0 ? "N" : "Y";
};

export const columns = [
    { id: "id", label: "ID", alignment: "left", minWidth: 20, visible: false, sortField: "id", sort: true, display: { type: 0, cell1: null } },
    { id: "name", label: "name", alignment: "center", minWidth: 100, visible: true, sortField: "name", sort: true, display: { type: 0, cell1: null } },
    { id: "classHour", label: "classHour", alignment: "center", minWidth: 100, visible: true, sortField: "classHour", sort: true, display: { type: 0, cell1: null } },
    { id: "isExamine", label: "isExamine", alignment: "center", minWidth: 30, visible: true, sortField: "isExamine", sort: true, display: { type: 1, cell1: CellIsExamine } },
    { id: "description", label: "description", alignment: "center", minWidth: 150, visible: true, sortField: "description", sort: true, display: { type: 1, cell1: CellDescription } },
    { id: "creator", label: "creator", alignment: "center", minWidth: 30, visible: true, sortField: "creator.name", sort: true, display: { type: 1, cell1: cellCreator } },
    { id: "createDate", label: "createDate", alignment: "center", minWidth: 30, visible: true, sortField: "createDate", sort: true, display: { type: 1, cell1: cellCreateDate } },
];