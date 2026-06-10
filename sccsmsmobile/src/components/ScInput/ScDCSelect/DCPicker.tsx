import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import ScPubTree from "../ScPubTree/ScPubTree";
import DocList from "../../DocList/DocList";
import { SimpDC } from "../../../dataType/types/dc";
import { simpDCRepo } from "../../../db/crud/dc";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

// Convert an Array of department objects into an array of Document Category IDs
const transforDCIDs = (dc: SimpDC) => {
    let selectDCIds = [];
    selectDCIds.push(dc.id);
    return selectDCIds;
};

const DcPicker = ({ pressItemAction, cancelAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.SimpDC>) => {
    const [dcs, setDcs] = useState<SimpDC[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const selectDCIds = transforDCIDs(currentItem);

    const handleInitDcs = (allFlag = allOrRecent) => {
        let localDcs = [];
        if (allFlag === "all") {
            localDcs = simpDCRepo.getAllData();
        } else {
            localDcs = simpDCRepo.getRecent();
        }
        setDcs(localDcs);
    };

    useEffect(() => {
        handleInitDcs();
    }, []);

    // Switch SeqmentedButton
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDcs(value);
    };

    // Actions after press Document Category item
    const handlePress = (item: SimpDC) => {
        if (allOrRecent === "all") {
            simpDCRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Actions after long press Document Category item
    const handleLongPress = (item: SimpDC) => {
        if (allOrRecent === "recent") {
            simpDCRepo.deleteRecent(item);
            handleInitDcs();
        }
        return
    };

    // Refresh
    const handleDocRefresh = async () => {
        await simpDCRepo.initCache();
        handleInitDcs(allOrRecent);
    };

    const DcCard = ({ item }: { item: SimpDC }) => {
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("dcName")}:{item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("category")}:{item.description}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("status")}:{item.status === 0 ? "normal" : "disable"}</Text>
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
                        docName={t("dc")}
                        isDisplayAll={false}
                        oriDocs={dcs}
                        onDocPress={handlePress}
                        selectDocIDs={selectDCIds}
                        onDocLongPress={handleLongPress}
                        isEdit={true}
                    />
                </ScrollView>
                : <DocList
                    rows={dcs}
                    ItemElement={DcCard}
                    rowsPerPage={10}
                    searchFields={["code", "name", "description", "leader"]}
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

export default DcPicker;
