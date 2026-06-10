import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import DocList from "../../DocList/DocList";
import { ExecutionProject } from "../../../dataType/types/epa";
import { EPARepo } from "../../../db/crud/epa";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const EPAPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.ExecutionProject>) => {
    const [docs, setDocs] = useState<ExecutionProject[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: ExecutionProject[] = [];
        if (allFlag === "all") {
            localDocs = EPARepo.getAllData();
        } else {
            localDocs = EPARepo.getRecent();
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

    // Actions after press Execution Project item
    const handlePress = (item: ExecutionProject) => {
        if (allOrRecent === "all") {
            EPARepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await EPARepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press Execution Project item
    const handleLongPress = (item: ExecutionProject) => {
        if (allOrRecent === "recent") {
            EPARepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const EPACard = ({ item }: { item: ExecutionProject }) => {
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
                    <Text style={{ width: "100%", padding: 2 }}>{t("resultType")} : {item.resultType.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("category")} : {item.epc.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("isCheckError")} : {item.isCheckError === 0 ? "N" : "Y"}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("errorValue")} : {item.errorValueDisp}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("isOnSitePhoto")} : {item.isOnSitePhoto === 0 ? "N" : "Y"}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("isRequireFile")} : {item.isRequireFile === 0 ? "N" : "Y"}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseEPA")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={EPACard}
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

export default EPAPicker;