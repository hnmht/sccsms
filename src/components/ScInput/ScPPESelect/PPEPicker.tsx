import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { PPE } from "../../../dataType/types/ppe";
import { PPERepo } from "../../../db/crud/ppe";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";

// Personal Protective Equipment
const PPEPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.PPE>) => {
    const [docs, setDocs] = useState<PPE[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: PPE[] = [];
        if (allFlag === "all") {
            localDocs = PPERepo.getAllData();
        } else {
            localDocs = PPERepo.getRecent();
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

    // Actions after press PPE item
    const handlePress = (item: PPE) => {
        if (allOrRecent === "all") {
            PPERepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await PPERepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press PPE item
    const handleLongPress = (item: PPE) => {
        if (allOrRecent === "recent") {
            PPERepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const PPECard = ({ item }: { item: PPE }) => {
        const doc = item;
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold" }}>{t("name")} :{doc.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>
                        {t("ppeModel")} :{doc.model}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>
                        {t("ppeUnit")} : {doc.unit}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>
                        {t("code")} : {doc.code}
                    </Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("choosePPE")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={PPECard}
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

export default PPEPicker;