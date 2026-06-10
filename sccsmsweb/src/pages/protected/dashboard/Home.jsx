import { useState, useEffect, useMemo } from "react";
import { Grid, Typography as MuiTypography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { green, red } from "@mui/material/colors";
import { dayjs } from "../../../i18n/dayjs";
import { cloneDeep } from "lodash";

import { Divider } from "../../../component/ScMui/ScMui";
import Loader from "../../../component/Loader/Loader";
import Actions from "./actions";
import Stats from "./stats";
import CSIssueRank from "./csIssueRank";
import Reviewed from "./reviewed";
import BeReviewed from "./beReviewed";
import RiskTrend from "./riskTrend";
import { reqGetDashboardData } from "../../../api/dashboard";
import { initDateIntervals } from "./constructor";

const Typography = styled(MuiTypography)(spacing);
const Home = () => {
    const [data, setData] = useState(undefined);
    const user = useSelector((state) => state.user);
    const dateIntervals = useMemo(initDateIntervals, []);
    const autoIndex = dayjs().hour() >= 12 ? 0 : 1;
    const [interval, setInterval] = useState(dateIntervals[autoIndex]);
    const { t } = useTranslation();

    useEffect(() => {
        async function initData() {
            const res = await reqGetDashboardData({ startDate: interval.startDate, endDate: interval.endDate });
            let newData = undefined;
            if (!res.status) {
                return
            }
            newData = res.data;
            setData(newData);
        }
        initData();
    }, [interval]);

    const handleRefresh = () => {
        let newInterval = cloneDeep(interval);
        setInterval(newInterval);
    };
    return (data !== undefined
        ? <>
            <Grid justifyContent="space-between" container spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom>
                        {t("dashboard")}
                    </Typography>
                    <Typography variant="subtitle1">
                        {`${user.name},${t("welcome")}!`}
                        <span role="img" aria-label="clap">
                            👋
                        </span>
                    </Typography>
                </Grid>
                <Grid item sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Actions interval={interval} dateIntervals={dateIntervals} setInterval={setInterval} refreshAction={handleRefresh} t={t} />
                </Grid>
            </Grid>
            <Divider my={2} />
            <Grid container spacing={6}>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title={t("issueOrders")}
                        amount={data.giveWo.freeCount + data.giveWo.confirmedCount + data.giveWo.executingCount + data.giveWo.completedCount}
                        chip={interval.label}
                        percentagetext={t("orderExecuted", { count: data.giveWo.executingCount + data.giveWo.completedCount })}
                        percentagecolor={green[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title={t("receivedOrders")}
                        amount={data.reciveWo.count}
                        chip={interval.label}
                        percentagetext={t("orderIncomplete", { count: data.reciveWo.unFinishedCount })}
                        percentagecolor={red[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title={t("discoveredIssues")}
                        amount={data.discoveredIssue.count}
                        chip={interval.label}
                        percentagetext={t("issuesResolved", { count: data.discoveredIssue.finished })}
                        percentagecolor={green[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title={t("handleIssues")}
                        amount={data.processIssue.completedCount}
                        chip={interval.label}
                        percentagetext={t("issuesNotHandled", { count: data.processIssue.unFinishedCount })}
                        percentagecolor={red[500]}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    {/* Risk Trend Chart */}
                    <RiskTrend t={t} />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    {/* Issues Ranking */}
                    <CSIssueRank problemdata={data.issueItems} chip={interval.label} t={t} />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={6}>
                    {/* Voucher review time */}
                    <Reviewed reviewData={data.reviewedItems} chip={interval.label} t={t} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    {/* Time voucher reviewed */}
                    <BeReviewed reviewData={data.beReviewedItems} chip={interval.label} t={t} />
                </Grid>
            </Grid>
        </>
        : <Loader />
    );
}
export default Home;
