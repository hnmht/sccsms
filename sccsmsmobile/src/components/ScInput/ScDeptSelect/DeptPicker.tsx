import { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import ScPubTree from "../ScPubTree/ScPubTree";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import { simpDeptRepo } from "../../../db/crud/department";
import DocList from "../../DocList/DocList";
import { pubParams } from "../../pub/pubParams";
import { SimpDept } from "../../../dataType/types/department";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

// Convert an Array of department objects into an array of department IDs
const transforDeptIDs = (dept: SimpDept) => {
    let selectDeptIds = [];
    selectDeptIds.push(dept.id);
    return selectDeptIds;
};

const DeptPicker = ({ pressItemAction, cancelAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.SimpDept>) => {
    const [depts, setDepts] = useState<SimpDept[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const selectedDeptIds = transforDeptIDs(currentItem);

    const handleInitDepts = (allFlag = allOrRecent) => {
        let localDepts: SimpDept[] = [];
        if (allFlag === "all") {
            localDepts = simpDeptRepo.getAllData();
        } else {
            localDepts = simpDeptRepo.getRecent();
        }
        setDepts(localDepts);
    };

    useEffect(() => {
        handleInitDepts();
    }, []);

    // Switch SegmentedButtons
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitDepts(value);
    };

    // Actions after press SimpDept Item
    const handlePress = (item: SimpDept) => {
        if (allOrRecent === "all") {
            simpDeptRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Actions after long press SimpDept Item
    const handleLongPress = (item: SimpDept) => {
        if (allOrRecent === "recent") {
            simpDeptRepo.deleteRecent(item);
            handleInitDepts();
        }
        return
    };

    // Refersh 
    const handleDocRefresh = async () => {
        await simpDeptRepo.initCache();
        handleInitDepts(allOrRecent);
    };

    const DeptCard = ({ item }: { item: SimpDept }) => {
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
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.primary }}>{t("deptName")}:{item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("deptCode")}:{item.code}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")}:{item.description}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>{t("leader")}:{item.leader.name}</Text>
                    <Text style={{ width: pubParams.screen.isOverSize ? "100%" : "50%", padding: 2 }}>{t("status")}:{t(item.status === 0 ? "normal" : "disable")}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseDept")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            {allOrRecent === "all"
                ? <ScrollView>
                    <ScPubTree
                        docName={t("department")}
                        isDisplayAll={true}
                        oriDocs={depts}
                        onDocPress={handlePress}
                        selectDocIDs={selectedDeptIds}
                        onDocLongPress={handleLongPress}
                        isEdit={true}
                    />
                </ScrollView>
                : <DocList<SimpDept>
                    rows={depts}
                    ItemElement={DeptCard}
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

export default DeptPicker;
