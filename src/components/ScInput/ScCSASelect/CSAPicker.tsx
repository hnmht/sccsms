import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { useAppSelector } from "../../../store/hooks";
import DocList from "../../DocList/DocList";
import { ConstructionSite } from "../../../dataType/types/csa";
import { CSRepo } from "../../../db/crud/csa";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const CSAPicker = ({ cancelAction, pressItemAction, currentItem, t, theme }: ScPickerProps<ScDataTypeList.ConstructionSite>) => {
    const csos = useAppSelector(state => state.dynamicData.csos);
    const [docs, setDocs] = useState<ConstructionSite[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: ConstructionSite[] = [];
        if (allFlag === "all") {
            localDocs = CSRepo.getAllData();
        } else {
            localDocs = CSRepo.getRecent();
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

    // Actions after press ConstructionSite item
    const handlePress = (item: ConstructionSite) => {
        if (allOrRecent === "all") {
            CSRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh
    const handleRefresh = async () => {
        await CSRepo.initCache();
        handleInitDocs(allOrRecent);
    };

    // Actions after long press ConstructionSite item
    const handleLongPress = (item: ConstructionSite) => {
        if (allOrRecent === "recent") {
            CSRepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    const CSACard = ({ item }: { item: ConstructionSite }) => {
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
                    <Text style={{ width: "100%", padding: 2 }}>{t("code")} :{item.code}</Text>
                    <Text style={{ width: "50%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("category")} : {item.csc.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("respDept")} : {item.respDept.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("respPerson")} : {item.respPerson.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("longitude")} : {item.longitude}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("latitude")} : {item.longitude}</Text>
                    {csos.map(cso => {
                        return cso.enable === 1
                            ? <Text style={{ width: "100%", padding: 2 }} key={cso.id}>{cso.displayName} : {(item as any)[cso.code]?.name}</Text>
                            : null
                    })}
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseCSA")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={CSACard}
                rowsPerPage={10}
                searchFields={["code", "name", "description", "itemclass.name", "respdept.name", "respperson.name",
                    "udf1.name", "udf2.name", "udf3.name", "udf4.name", "udf5.name", "udf6.name", "udf7.name", "udf8.name", "udf9.name", "udf10.name",]}
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

export default CSAPicker;