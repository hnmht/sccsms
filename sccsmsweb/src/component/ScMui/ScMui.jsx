import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
    Divider as MuiDivider,
    List as MuiList,
    Button as MuiButton
} from "@mui/material";

export const Divider = styled(MuiDivider)(spacing);
export const List = styled(MuiList)`
    ${spacing}; 
`;
export const Button = styled(MuiButton)(spacing);