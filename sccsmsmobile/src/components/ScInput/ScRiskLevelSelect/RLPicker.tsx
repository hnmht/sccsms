import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { RiskLevel } from "../../../dataType/types/riskLevel";
import { riskLevelRepo } from "../../../db/crud/risklevel";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const RLPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.RiskLevel>) => {
    const [docs, setDocs] = useState<RiskLevel[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs:RiskLevel[] = [];
        if (allFlag === "all") {
            localDocs = riskLevelRepo.getAllData();
        } else {
            localDocs = riskLevelRepo.getRecent();
        }
        setDocs(localDocs);
    };

    useEffect(() => {
        handleInitDocs();
    }, []);

    // Switch SegmentedButton
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDocs(value);
    };

    // Actions after press Risk Level item
    const handlePress = (item: RiskLevel) => {
        if (allOrRecent === "all") {
            riskLevelRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await riskLevelRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press Risk Level item
    const handleLongPress = (item: RiskLevel) => {
        if (allOrRecent === "recent") {
            riskLevelRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const RLCard = ({ item }: { item: RiskLevel }) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        margin: 4
                    }}
                    onPress={() => handlePress(item)}
                    onLongPress={() => handleLongPress(item)}
                >
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>
                        {t("name")} : {item.name}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <View style={{ height: 24, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                        <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("color")} : </Text>
                        <View style={{ height: "100%", width: 48, backgroundColor: item.color, borderRadius: 8 }}></View>
                    </View>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")}:{item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseRiskLevel")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={RLCard}
                rowsPerPage={10}
                searchFields={["name", "description"]}
                sortFunction={(a, b) => a.id - b.id}
                refreshing={false}
            />
            <ScHandSwitch
                refreshDisplay={true}
                docRefresh={handleRefresh}
                cancelAction={cancelAction}
                theme={theme}
                t={t}
            />
        </View>
    );
};

export default RLPicker;