import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import FunctionsIcon from '@mui/icons-material/Functions';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
    Card as MuiCard,
    CardContent,
    CardHeader,
    IconButton,
    Grid,
    Menu,
    MenuItem,
    Popover
} from "@mui/material";
import { spacing } from "@mui/system";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    RadialLinearScale,
} from 'chart.js';
import { dayjs, DateTimeFormat, DateTimeFormatSpec } from "../../../i18n/dayjs";
import { PolarArea, Line } from 'react-chartjs-2';

import { transRiskTrendsToPolarArea, transRiskTrendsToLine } from "./constructor";
import { reqGetRiskTrend } from "../../../api/dashboard";
import DateInterval from "./dateInterval";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
    Colors
);
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 412px;
`;

const RiskTrend = ({ t }) => {
    const [rlData, setRlData] = useState([]);
    const [groupBy, setGroupBy] = useState("occDay");
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [popOpen, setPopOpen] = useState(false);
    const [interval, setInterval] = useState({ startDate: dayjs(new Date()).subtract(7, "day").startOf("day"), endDate: dayjs(new Date()).endOf("day") });

    useEffect(() => {
        async function initData() {
            const res = await reqGetRiskTrend({ startDate: interval.startDate, endDate: interval.endDate });
            let newData = { startDate: "", endDate: "", riskTrends: [] };
            if (res.status) {
                newData = res.data;
            }
            newData.riskTrends?.map(item => {
                item.occDay = DateTimeFormat(item.occDay, "L");
            })
            setRlData(newData.riskTrends);
        }
        initData();
    }, [interval, t]);

    // Convert Data
    const polarData = transRiskTrendsToPolarArea(rlData);
    const lineData = transRiskTrendsToLine(rlData, groupBy);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const handleClickCalendar = (event) => {
        setAnchorEl(event.currentTarget);
        setPopOpen(true)
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };
    const handleClickMenuItem = (item) => {
        setGroupBy(item);
        handleCloseMenu();
    };
    const handleClosePop = () => {
        setPopOpen(false);
        setAnchorEl(null);
    };
    const handleIntervalOk = (dataInterval) => {
        setInterval(dataInterval);
        handleClosePop();
    };
    return (
        <Card mb={6}>
            <CardHeader
                title={t("riskTrend", { startDate: DateTimeFormatSpec(interval.startDate, "L"), endDate: DateTimeFormatSpec(interval.endDate, "L") })}
                action={
                    <>
                        <IconButton aria-label="filter" size="large" onClick={handleClickCalendar}>
                            <CalendarMonthIcon color="secondary" />
                        </IconButton>
                        <IconButton aria-label="settings" size="large" onClick={handleClickMenu}>
                            <FunctionsIcon color="secondary" />
                        </IconButton>
                    </>
                }
            />
            <Menu
                id="riskLevel-groupby"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => handleClickMenuItem("occDay")}>{t("byDay")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("occWeek")}>{t("byWeek")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("occMonth")}>{t("byMonth")}</MenuItem>
                <MenuItem onClick={() => handleClickMenuItem("occYear")}>{t("byYear")}</MenuItem>
            </Menu>
            <Popover
                id="intervalPoper"
                open={popOpen}
                anchorEl={anchorEl}
                onClose={handleClosePop}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <DateInterval
                    initValue={interval}
                    onOk={handleIntervalOk}
                    onCancel={handleClosePop}
                    t={t}
                />
            </Popover>
            <CardContent>
                <Grid container>
                    <Grid item xs={9}>
                        <ChartWrapper>
                            <Line options={lineData.options} data={lineData.data} />
                        </ChartWrapper>
                    </Grid>
                    <Grid item xs={3}>
                        <ChartWrapper>
                            <PolarArea data={polarData} />
                        </ChartWrapper>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
export default RiskTrend;
