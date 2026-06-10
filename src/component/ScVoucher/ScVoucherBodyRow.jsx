import { useContext, memo } from "react";
import styled from "@emotion/styled";
// import { Stack } from "@mui/material";

import { ColumnWidthContext } from "./columnContext";

const StyledBodyRow = styled.table`
    width: 100%;
    display: grid;
    overflow-x: none;
    overflow-y:none; 
    border-collapse:collapse;
    
    tbody,
    tr {
        display:contents;        
    }
    td:first-of-type {
        border-left:none;
    }

    td {
        display:flex;
        align-items:center;
        justify-content:center;
        text-align: center;
        padding: 2px 3px;     
        border: 1px solid #ccc;
        border-collapse:collapse;
    }
    td span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block
    }
   
`;

const ScVoucherBodyRow = ({ children }) => {
    const colWidth = useContext(ColumnWidthContext);
    return (
        // <Stack component="div"  id="bodyRowContainer" sx={{ height: 512, width: colWidth.width, overflowY: "visible", overflowX: "visible" }}>            
        <StyledBodyRow id="bodyTable" style={{ gridTemplateColumns: colWidth.gridCols, width: colWidth.width }}>
            <tbody>
                {children}
            </tbody>
        </StyledBodyRow>
        // </Stack>
    );
};

export default memo(ScVoucherBodyRow);