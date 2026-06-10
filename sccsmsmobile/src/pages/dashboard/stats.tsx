import { TFunction } from "i18next";
import { View, useWindowDimensions } from "react-native";
import {  MD3Theme, Surface, Text } from "react-native-paper";
const itemSpace = 8;
interface StatsProps {
    title: string;
    amount: number;
    chip: string;
    percentageText: string;
    percentageColor: string;
    theme: MD3Theme;
    t: TFunction;
}

function Stats({
    title,
    amount,
    chip,
    percentageText,
    percentageColor,
    theme,
    t
}: StatsProps) {
    const screen = useWindowDimensions();
    const rowWidth = screen.width - itemSpace * 2;
    const itemWidth = rowWidth / 2;
    return (
        <Surface style={{ display: "flex", width: itemWidth, marginTop: 8, marginLeft: itemSpace / 2, marginRight: itemSpace / 2, paddingLeft: itemSpace, borderRadius: 8 }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4, marginRight: 8,marginLeft:8 }}>
                <Text variant="titleMedium" maxFontSizeMultiplier={1.0}>{t(title)}</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", height: 80 }}>
                <Text variant="displaySmall" maxFontSizeMultiplier={1.0}>{amount}</Text>
            </View>
            <View style={{ height: 40, alignItems: "center", justifyContent: "flex-start" }}>
                <Text variant="titleSmall" maxFontSizeMultiplier={1.0} style={{ color: percentageColor }}>{percentageText}</Text>
            </View>
        </Surface>

    );
};

export default Stats;
