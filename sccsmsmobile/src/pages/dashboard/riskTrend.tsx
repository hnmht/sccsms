import { View } from "react-native";
import { Card, Text, Divider, Chip, MD3Theme } from "react-native-paper";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { transProblemDataToRiskPie } from "./constructor";
import { IssueItem } from "../../dataType/types/dashboard";
import { TFunction } from "i18next";

interface RiskTrendProps {
    issueData: IssueItem[];
    chip: string;
    theme: MD3Theme;
    t: TFunction;
}

const renderDot = (color: any) => {
    return (
        <View
            style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: color,
                marginRight: 10,
            }}
        />
    );
};

const renderLegendComponent = (pieData: pieDataItem[]) => {
    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 8,
                    flexWrap: "wrap"
                }}
            >
                {pieData.map(item =>
                    <View
                        key={item.color}
                        style={{
                            flexDirection: 'row',
                            alignItems: "center",
                            marginRight: 4,
                        }}>
                        {renderDot(item.color)}
                        <Text maxFontSizeMultiplier={1.2}>{item.text}: {item.value}</Text>
                    </View>
                )}
            </View>
        </>
    );
};


function RiskTrend({ issueData, chip, theme, t }: RiskTrendProps) {
    const pieData = transProblemDataToRiskPie(issueData);
    return (
        <Card>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 4 }}>
                <Text variant="titleMedium" maxFontSizeMultiplier={1.2} style={{ paddingLeft: 8 }}>{t("riskDistribution")}</Text>
            </View>
            <Divider />
            <View style={{ display: "flex", alignItems: "center", marginLeft: 16, marginTop: 8, justifyContent: "center" }}>
                <PieChart
                    donut
                    showGradient
                    data={pieData}
                    focusOnPress
                    radius={130}
                    innerRadius={60}
                />
                {renderLegendComponent(pieData)}
            </View>
        </Card>
    );
};

export default RiskTrend;