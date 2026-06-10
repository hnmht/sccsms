import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { UserDefineCategory } from "../../../dataType/types/udc";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import { UDCRepo } from "../../../db/crud/udc";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { ScPickerProps } from "../../../dataType/types/scInput";

const UDCPicker = ({ cancelAction, currentItem, pressItemAction, t, theme }: ScPickerProps<ScDataTypeList.UserDefineCategory>) => {
    const [docs, setDocs] = useState<UserDefineCategory[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs = [];
        if (allFlag === "all") {
            localDocs = UDCRepo.getAllData();
        } else {
            localDocs = UDCRepo.getRecent();
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

    // Actions after press UserDefineCategory item
    const handlePress = (item: UserDefineCategory) => {
        if (allOrRecent === "all") {
            UDCRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await UDCRepo.initCache()
        handleInitDocs(allOrRecent);
    };

    // Actions after long press UserDefineCategory item
    const handleLongPress = (item: UserDefineCategory) => {
        if (allOrRecent === "recent") {
            UDCRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const UDCCard = ({ item }: { item: UserDefineCategory }) => {
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("name")} :{item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} :{item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseUDC")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={UDCCard}
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

export default UDCPicker;