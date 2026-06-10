import { useState } from "react";
import { View } from "react-native";
import { Card, Text, IconButton, Menu, Divider, MD3Theme } from "react-native-paper";
import { fieldNames, transBeReviewDataToTable } from "./constructor";
import DynamicTable from "./dynamicTable";
import { BeReviewedItem } from "../../dataType/types/dashboard";
import { TFunction } from "i18next";

interface BeReviewedProps {
    beReviewedData: BeReviewedItem[];
    chip: string;
    theme: MD3Theme;
    t: TFunction;
}

function BeReviewed({ beReviewedData, chip, theme, t }: BeReviewedProps) {
    const [groupBy, setGroupBy] = useState<keyof BeReviewedItem>("reviewerName");
    const [menuVisible, setMenuVisible] = useState(false);
    const data = transBeReviewDataToTable(beReviewedData, groupBy);
    const handlePressMenuItem = (item: keyof BeReviewedItem) => {
        setGroupBy(item);
        setMenuVisible(false);
    };

    return (
        <Card style={{ marginTop: 8 }}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="titleMedium" allowFontScaling={false}>{t("beReviewedRanking", { name: t(fieldNames[groupBy]) })}</Text>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                        anchorPosition="bottom"
                    >
                        <Menu.Item title={t("reviewer")} onPress={() => handlePressMenuItem("reviewerName")} />
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

export default BeReviewed;