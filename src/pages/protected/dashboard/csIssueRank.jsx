import { useState } from "react";
import styled from "@emotion/styled";
import MoreVertical from '@mui/icons-material/MoreVert';
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import {
    Card as MuiCard,
    CardContent,
    CardHeader,
    IconButton,
    Grid,
    Menu,
    MenuItem,
    TableHead,
    TableBody,
    Table,
    TableRow,
    TableCell,
    Box,
    Chip
} from "@mui/material";
import { spacing } from "@mui/system";
import { transProblemDataToPieData } from "./constructor";
import { MultiSortByArr } from "../../../utils/tools";
import { fieldNames } from "./constructor";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 378px;
`;

const options = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        colors: {
            forceOverride: true
        }
    },
    cutout: "50%",
};

const CSIssueRank = ({ problemdata, chip, t }) => {
    const [groupBy, setGroupBy] = useState("epaName");
    const [anchorEl, setAnchorEl] = useState(null);

    // Convert Data
    const data = transProblemDataToPieData(problemdata, groupBy);
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

    return (
        <Card mb={6}>
            <CardHeader
                action={
                    <>
                        <Chip label={t(chip)} color="secondary" />
                        <IconButton aria-label="settings" size="large" onClick={handleClick}>
                            <MoreVertical />
                        </IconButton>
                    </>
                }
                title={t("issueRanking", { name: t(fieldNames[groupBy]) })}
            />
            <Menu
                id="eid-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleClickMenuItem("csaName")}>{t("csa")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("cscName")}>{t("csc")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("epaName")}>{t("epa")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("epcName")}>{t("epc")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("respName")}>{t("respPerson")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("creatorName")}>{t("executor")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("isFinish")}>{t("isCompleted")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("isRectify")}>{t("isRectify")}</MenuItem>
            </Menu>
            <CardContent>
                <Grid container>
                    <Grid item xs={4}>
                        <ChartWrapper>
                            <Pie data={data.pieData} options={options} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={8} >
                        <Box sx={{ height: "420px", overflow: "auto" }}>
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
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
export default CSIssueRank;
