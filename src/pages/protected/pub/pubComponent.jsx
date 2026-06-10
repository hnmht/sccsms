import { Typography } from "@mui/material";
// Display Description Cell Content
export const CellDescription = (row, column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.description}</span>;
};

// Display Risk Level Content
export const CellRiskLevel = (row, column) => {
    return (<div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, borderRadius: 4, backgroundColor: row.riskLevel.color }}>
        <Typography variant="body1" style={{ padding: 4 }}>{row.riskLevel.name}</Typography>
    </div>);
};

// Display Name Cell content
export const CellName = (row,column) => {
    return <span style={{ width: column.minWidth, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{row.name}</span>;

}