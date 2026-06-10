import { useState } from "react";
import { View } from "react-native";
import { Card, Text, IconButton, Menu, Divider, MD3Theme } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";

import { pubParams } from "../../components/pub/pubParams";
import { transIssueDataToPieData, fieldNames } from "./constructor";
import DynamicTable from "./dynamicTable";
import { IssueItem } from "../../dataType/types/dashboard";
import { TFunction } from "i18next";

interface IssueRankProps {
    issueData: IssueItem[];
    chip: string;
    theme: MD3Theme;
    t: TFunction
}

function IssueRank({ issueData, chip, theme, t }: IssueRankProps) {
    const [groupBy, setGroupBy] = useState<keyof IssueItem>("epaName");
    const [menuVisible, setMenuVisible] = useState(false);
    const data = transIssueDataToPieData(issueData, groupBy);
    const handlePressMenuItem = (item: keyof IssueItem) => {
        setGroupBy(item);
        setMenuVisible(false);
    };

    return (
        <Card style={{ marginTop: 8 }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="titleMedium" allowFontScaling={false} style={{ paddingLeft: 8 }}>{t("issueRanking", { name: t(fieldNames[groupBy]) })}</Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                        anchorPosition="bottom"
                    >
                        <Menu.Item title={t("csa")} onPress={() => handlePressMenuItem("csaName")} />
                        <Menu.Item title={t("csc")} onPress={() => handlePressMenuItem("cscName")} />
                        <Menu.Item title={t("epa")} onPress={() => handlePressMenuItem("epaName")} />
                        <Menu.Item title={t("epc")} onPress={() => handlePressMenuItem("epcName")} />
                        <Menu.Item title={t("respPerson")} onPress={() => handlePressMenuItem("respName")} />
                        <Menu.Item title={t("executor")} onPress={() => handlePressMenuItem("creatorName")} />
                        <Menu.Item title={t("isCompleted")} onPress={() => handlePressMenuItem("isFinish")} />
                        <Menu.Item title={t("isRectify")} onPress={() => handlePressMenuItem("isRectify")} />
                    </Menu>
                </View>
            </View>
            <Divider />
            <View style={{ alignItems: "center", marginLeft: 16 }}>
                <BarChart
                    initialSpacing={12 / pubParams.screen.fontScale}
                    hideRules
                    showFractionalValues
                    data={data.pieData}
                    frontColor={theme.colors.error}
                    xAxisLabelTextStyle={{ fontSize: 12 / pubParams.screen.fontScale }}
                    yAxisTextStyle={{ fontSize: 12 / pubParams.screen.fontScale }}
                />
                <Divider />
                <DynamicTable rows={data.rows} groupBy={groupBy} numberColumnTitle="quantity" theme={theme} t={t} />
            </View>
        </Card>
    );
};

export default IssueRank;