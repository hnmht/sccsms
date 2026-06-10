import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { TC } from "../../../dataType/types/tc";
import { TCRepo } from "../../../db/crud/tc";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";

// Traning Course Picker
const TCPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.TC>) => {
    const [docs, setDocs] = useState<TC[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: TC[] = [];
        if (allFlag === "all") {
            localDocs = TCRepo.getAllData();
        } else {
            localDocs = TCRepo.getRecent();
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

    // Actions after press Traning Course item
    const handlePress = (item: TC) => {
        if (allOrRecent === "all") {
            TCRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await TCRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press Training Course item
    const handleLongPress = (item: TC) => {
        if (allOrRecent === "recent") {
            TCRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const TCCard = ({ item }: { item: TC }) => {
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
                        {t("tcName")} : {item.name}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("tcClassHour")} : {currentItem.classHour}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("isExam")} : {currentItem.isExamine === 0 ? "N" : "Y"}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseTC")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={TCCard}
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

export default TCPicker;