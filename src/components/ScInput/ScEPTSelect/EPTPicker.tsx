import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { EPT } from "../../../dataType/types/ept";
import { EPTRepo } from "../../../db/crud/ept";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const EPTPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.EPT>) => {
    const [docs, setDocs] = useState<EPT[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs = [];
        if (allFlag === "all") {
            localDocs = EPTRepo.getAllData();
        } else {
            localDocs = EPTRepo.getRecent();
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

    // Actions after press Execution Project Template item
    const handlePress = (item: EPT) => {
        if (allOrRecent === "all") {
            EPTRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await EPTRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press Execution Project Template item
    const handleLongPress = (item: EPT) => {
        if (allOrRecent === "recent") {
            EPTRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const EPTCard = ({ item }: { item: EPT }) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 4 }}>
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("name")} : {item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("code")} : {item.code}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseEPT")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={EPTCard}
                rowsPerPage={10}
                searchFields={["code", "name", "description"]}
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

export default EPTPicker;