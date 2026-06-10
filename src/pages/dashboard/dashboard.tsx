import { useEffect, useState, useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Text, useTheme, ActivityIndicator, Surface } from "react-native-paper";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { dayjs } from "../../i18n/dayjs";
import { reqGetDashboardData } from "../../api/dashboard";
import { initDateIntervals } from "./constructor";
import { DashBoardData, DateInterval } from "../../dataType/types/dashboard";
import { useAppSelector } from "../../store/hooks";

import Actions from "./actions";
import Stats from "./stats";
import RiskTrend from "./riskTrend";
import IssueRank from "./issueRank";
import Reviewed from "./reviewed";
import BeReviewed from "./beReviewed";

function Dashboard() {
    const theme = useTheme();
    const { t } = useTranslation();
    const [data, setData] = useState<DashBoardData | undefined>(undefined);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const user = useAppSelector(state => state.user);
    const dateIntervals = useMemo(initDateIntervals, []);
    const autoIndex = dayjs().hour() >= 12 ? 0 : 1;
    const [interval, setInterval] = useState<DateInterval>(dateIntervals[autoIndex]);

    useEffect(() => {
        async function initData() {
            setRefreshing(true);
            let newData: DashBoardData = {
                startDate: interval.startDate,
                endDate: interval.endDate,
                giveWo: { freeCount: 0, confirmedCount: 0, executingCount: 0, completedCount: 0 },
                reciveWo: { count: 0, unFinishedCount: 0 },
                discoveredIssue: { count: 0, finished: 0 },
                processIssue: { completedCount: 0, unFinishedCount: 0 },
                issueItems: [],
                reviewedItems: [],
                beReviewedItems: []
            };
            const res = await reqGetDashboardData(newData);
            if (res.status) {
                newData = res.data;
            }
            setData(newData);
            setRefreshing(false);
        }
        initData();
    }, [interval]);

    const handleRefresh = () => {
        let newInterval = cloneDeep(interval);
        setInterval(newInterval);
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <Surface style={{ height: 80, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 4 }}>
                <View>
                    <Text variant="titleLarge" allowFontScaling={false}>{`${user.name}`}</Text>
                    <Text variant="titleMedium" allowFontScaling={false}>{`${t("welcome")}! 👋`}</Text>
                </View>
                <Actions interval={interval} dateIntervals={dateIntervals} setInterval={setInterval} theme={theme} t={t} />
            </Surface>
            {data !== undefined
                ? <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />}
                    style={{ flex: 1 }}
                >
                    <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
                        <Stats
                            title="issueOrders"
                            amount={data.giveWo.freeCount + data.giveWo.confirmedCount + data.giveWo.executingCount + data.giveWo.completedCount}
                            chip={interval.label}
                            percentageText={t("orderExecuted", { count: data.giveWo.executingCount + data.giveWo.completedCount })}
                            percentageColor={'#4caf50'}
                            theme={theme}
                            t={t}
                        />
                        <Stats
                            title="receivedOrders"
                            amount={data.reciveWo.count}
                            chip={interval.label}
                            percentageText={t("orderIncomplete", { count: data.reciveWo.unFinishedCount })}
                            percentageColor={'#f44336'}
                            theme={theme}
                            t={t}
                        />
                        <Stats
                            title="discoveredIssues"
                            amount={data.discoveredIssue.count}
                            chip={interval.label}
                            percentageText={t("issuesResolved", { count: data.discoveredIssue.finished })}
                            percentageColor={'#4caf50'}
                            theme={theme}
                            t={t}
                        />
                        <Stats
                            title="handleIssues"
                            amount={data.processIssue.completedCount}
                            chip={interval.label}
                            percentageText={t("issuesNotHandled", { count: data.processIssue.unFinishedCount })}
                            percentageColor={'#f44336'}
                            theme={theme}
                            t={t}
                        />
                    </View>
                    <RiskTrend issueData={data.issueItems} chip={interval.label} theme={theme} t={t} />
                    <IssueRank issueData={data.issueItems} chip={interval.label} theme={theme} t={t} />
                    <Reviewed reviewedData={data.reviewedItems} chip={interval.label} theme={theme} t={t} />
                    <BeReviewed beReviewedData={data.beReviewedItems} chip={interval.label} theme={theme} t={t} />
                </ScrollView>
                : <ActivityIndicator color={theme.colors.primary} animating={true} />
            }
        </SafeAreaView>
    );
};

export default Dashboard;