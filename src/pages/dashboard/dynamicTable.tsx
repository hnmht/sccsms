import { View } from "react-native";
import { Text, Divider, MD3Theme } from "react-native-paper";

import { fieldNames } from "./constructor";
import { multiSortByArr } from "../../components/tools/sort";
import { BeReviewedItem, IssueItem, ReviewedEORecord } from "../../dataType/types/dashboard";
import { TFunction } from "i18next";

interface IssueTableProps {
    rows: any[];
    groupBy: keyof IssueItem | keyof ReviewedEORecord | keyof BeReviewedItem;
    numberColumnTitle: string;
    theme: MD3Theme;
    t: TFunction;
}

function DynamicTable({ rows, groupBy, numberColumnTitle, theme, t }: IssueTableProps) {
    return (
        <View style={{ width: "100%" }}>
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", height: 49 }}>
                <View style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                    <Text variant="titleSmall" allowFontScaling={false} key="sort">{t("ranking")}</Text>
                </View>
                <View style={{ width: "70%", justifyContent: "center", alignItems: "center" }}>
                    <Text variant="titleSmall" allowFontScaling={false} key="itemName">{t(fieldNames[groupBy])}</Text>
                </View>
                <View style={{ width: "15%", marginRight: 4 }}>
                    <Text variant="titleSmall" allowFontScaling={false} key="number">{t(numberColumnTitle)}</Text>
                </View>
            </View>
            <Divider />
            <View style={{ justifyContent: "center", alignItems: "center" }} >
                {rows.length > 0
                    ? rows.sort(multiSortByArr([{ field: "value", order: "desc" }])).map((row, index) => {
                        return (
                            <View key={index} style={{ width: "100%", flexDirection: "row", alignItems: "center", minHeight: 42 }}>
                                <View key={`${index}sort`} style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                                    <Text variant="bodyLarge" allowFontScaling={false}>{index + 1}</Text>
                                </View>
                                <Text style={{ width: "70%" }} allowFontScaling={false} variant="bodyLarge" >{row[groupBy]}</Text>
                                <View key={`${index}number`} style={{ width: "15%", alignItems: "center", justifyContent: "center" }}>
                                    <Text variant="bodyLarge" allowFontScaling={false}>{row.value}</Text>
                                </View>
                            </View>
                        )
                    })

                    : <Text
                        variant="titleSmall"
                        allowFontScaling={false}
                        key="noData"
                        style={{ color: theme.colors.error,minHeight:64,marginTop:24 }}
                    >
                        {t("noData")}
                    </Text>

                }
            </View>
        </View>
    );
};

export default DynamicTable;