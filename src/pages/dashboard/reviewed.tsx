import { useState } from "react";
import { View } from "react-native";
import { Card, Text, IconButton, Menu, Divider, Chip, MD3Theme } from "react-native-paper";
import { transReviewDataToTable, fieldNames } from "./constructor";
import DynamicTable from "./dynamicTable";
import { ReviewedEORecord } from "../../dataType/types/dashboard";
import { TFunction } from "i18next";

interface ReviewedProps {
    reviewedData: ReviewedEORecord[];
    chip: string;
    theme: MD3Theme;
    t: TFunction;
}

function Reviewed({ reviewedData, chip, theme, t }: ReviewedProps) {
    const [groupBy, setGroupBy] = useState<keyof ReviewedEORecord>("csaName");
    const [menuVisible, setMenuVisible] = useState(false);
    const data = transReviewDataToTable(reviewedData, groupBy);
    const handlePressMenuItem = (item: keyof ReviewedEORecord) => {
        setGroupBy(item);
        setMenuVisible(false);
    };

    return (
        <Card style={{ marginTop: 8 }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="titleMedium" allowFontScaling={false}>{t("reviewRanking", { name: t(fieldNames[groupBy]) })}</Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                        anchorPosition="bottom"
                    >
                        <Menu.Item title={t("executor")} onPress={() => handlePressMenuItem("creatorName")} />
                        <Menu.Item title={t("csa")} onPress={() => handlePressMenuItem("csaName")} />
                        <Menu.Item title={t("billNumber")} onPress={() => handlePressMenuItem("billNumber")} />
                    </Menu>
                </View>
            </View>
            <Divider />
            <DynamicTable rows={data.rows} groupBy={groupBy} numberColumnTitle="timeSeconds" theme={theme} t={t} />
        </Card>
    );
};

export default Reviewed;