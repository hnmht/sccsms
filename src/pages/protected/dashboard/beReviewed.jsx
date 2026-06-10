import { useState } from "react";
import styled from "@emotion/styled";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
    Card as MuiCard,
    CardHeader,
    IconButton,
    Paper as MuiPaper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Menu,
    MenuItem,
    Chip,
} from "@mui/material";
import { spacing } from "@mui/system";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { fieldNames, transReviewDataToTable } from "./constructor";
import { MultiSortByArr } from "../../../utils/tools";
const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const TableWrapper = styled.div`
    height:360px;
    overflow-y: auto;
    max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

const BeReviewed = ({ reviewData, chip, t }) => {
    const [groupBy, setGroupBy] = useState("reviewerName");
    const [anchorEl, setAnchorEl] = useState(null);
    // Convert Data
    const data = transReviewDataToTable(reviewData, groupBy);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClickMenuItem = (item) => {
        setGroupBy(item);
        handleClose();
    };
    return (<Card mb={6}>
        <CardHeader
            action={
                <>
                    <Chip label={t(chip)} color="secondary" />
                    <IconButton aria-label="settings" size="large" onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>
                </>
            }
            title={t("beReviewedRanking", { name: t(fieldNames[groupBy]) })}
        />
        <Menu
            id="eid-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => handleClickMenuItem("reviewerName")}>{t("reviewer")}</MenuItem>
            <MenuItem onClick={() => handleClickMenuItem("csaName")}>{t("csa")}</MenuItem>
            <MenuItem onClick={() => handleClickMenuItem("billNumber")}>{t("billNumber")}</MenuItem>
        </Menu>
        <Paper>
            <TableWrapper>
                <ReactPerfectScrollbar>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {data.columns.map(col =>
                                    <TableCell align="center" key={col}>{t(col)}</TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.rows.sort(MultiSortByArr([{ field: "value", order: "desc" }])).map((row, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell align="center" >{index + 1}</TableCell>
                                        <TableCell align="center">{row[groupBy]}</TableCell>
                                        <TableCell align="center">{row.value}</TableCell>
                                    </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </ReactPerfectScrollbar>
            </TableWrapper>
        </Paper>
    </Card>);
};

export default BeReviewed;
