import { useContext,memo } from "react";
import styled from "@emotion/styled";
import { ColumnWidthContext } from "./columnContext";

const StyledBodyFooter = styled.table`
    width: 100%;
    display: grid;
    overflow-x: none;
    overflow-y:none;
    background: ${(props) => props.theme.palette.background.default};
    height:45px;
    border-collapse:collapse;
    position:sticky;
    bottom:0;

    tfoot,    
    tr {
        display:contents;      
    }
    td {
        text-align: center;
        font-size: 12px;
        padding: 2px 3px;
        line-height:40px;
        border: 1px solid #ccc;
    }   
`;

const ScVoucherBodyFooter = ({ children }) => {
    const colWidth = useContext(ColumnWidthContext);
    return (
        <StyledBodyFooter style={{ gridTemplateColumns: colWidth.gridCols, width: colWidth.width }}>
            <tfoot>
                <tr>
                    {children}
                </tr>               
            </tfoot>
        </StyledBodyFooter>
    );
};

export default memo(ScVoucherBodyFooter);