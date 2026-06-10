import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text, SegmentedButtons } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { Position } from "../../../dataType/types/postion";
import { positionRepo } from "../../../db/crud/position";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const PositionPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.Position>) => {
    const [docs, setDocs] = useState<Position[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag: "recent" | "all" = allOrRecent) => {
        let localDocs = [];
        if (allFlag === "all") {
            localDocs = positionRepo.getAllData();
        } else {
            localDocs = positionRepo.getRecent();
        }
        setDocs(localDocs);
    };

    useEffect(() => {
        handleInitDocs();
    }, []);

    // Switch SegmentedButtons
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDocs(value);
    };

    // Actions after press Position item
    const handlePress = (item: Position) => {
        if (allOrRecent === "all") {
            positionRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Reresh
    const handleRefresh = async () => {
        await positionRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press Position item 
    const handleLongPress = (item: Position) => {
        if (allOrRecent === "recent") {
            positionRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const PositionCard = ({ item }: { item: Position }) => {
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
                        {t("positionName")} : {item.name}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("selectPosition")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={PositionCard}
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

export default PositionPicker;