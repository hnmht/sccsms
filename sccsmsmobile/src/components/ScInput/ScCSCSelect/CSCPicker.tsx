import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, Card } from "react-native-paper";
import { TFunction } from "i18next";

import ScPubTree from "../ScPubTree/ScPubTree";
import DocList from "../../DocList/DocList";
import { SimpCSC } from "../../../dataType/types/csc";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import { simpCSCRepo } from "../../../db/crud/csc";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

// Convert an Array of SimpCSC object into an array of SimpCSC IDs
const convertCSCsToIDs = (csc: SimpCSC) => {
    let selectDocIds: number[] = [];
    selectDocIds.push(csc.id);
    return selectDocIds;
};

const SICPicker = ({ pressItemAction, cancelAction, currentItem, t,theme }: ScPickerProps<ScDataTypeList.SimpCSC>) => {
    const [docs, setDocs] = useState<SimpCSC[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const selectedDocIds = convertCSCsToIDs(currentItem);
    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: SimpCSC[] = [];
        if (allFlag === "all") {
            localDocs = simpCSCRepo.getAllData()
        } else {
            localDocs = simpCSCRepo.getRecent();
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

    // Actions after press SimpCSC item
    const handlePress = (item: SimpCSC) => {
        if (allOrRecent === "all") {
            simpCSCRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Actions after long press SimpCSC item
    const handleLongPress = (item: SimpCSC) => {
        if (allOrRecent === "recent") {
            simpCSCRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    // Refresh
    const handleDocRefresh = async () => {
        await simpCSCRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    const SICCard = ({ item }: { item: SimpCSC }) => {
        return (
            <Card key={item.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        margin: 4
                    }}
                    onPress={() => pressItemAction(item)}
                    onLongPress={() => handleLongPress(item)}
                >
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("name")} : {item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")}: {t(item.status === 0 ? "normal" : "disable")}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>           
            <ScSegmentAllOrRecent
                title={t("chooseCategory")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            {allOrRecent === "all"
                ? <ScrollView>
                    <ScPubTree
                        docName={t("category")}
                        isDisplayAll={false}
                        oriDocs={docs}
                        onDocPress={handlePress}
                        selectDocIDs={selectedDocIds}
                        onDocLongPress={handleLongPress}
                        isEdit={true}
                    />
                </ScrollView>
                : <DocList
                    rows={docs}
                    ItemElement={SICCard}
                    rowsPerPage={10}
                    searchFields={["name", "description"]}
                    sortFunction={(a, b) => a.id - b.id}
                    refreshing={false}
                />
            }
            <ScHandSwitch
                refreshDisplay={true}
                docRefresh={handleDocRefresh}
                cancelAction={cancelAction}
                theme={theme}
                t={t}
            />

        </View>
    )
};

export default SICPicker;
