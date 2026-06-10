import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, MD3Theme, Text, useTheme } from "react-native-paper";
import { TFunction } from "i18next";
import DocList from "../../DocList/DocList";
import { UserDefinedArchive } from "../../../dataType/types/uda";
import { UserDefineCategory } from "../../../dataType/types/udc";
import { UDARepo } from "../../../db/crud/uda";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";

interface UDAPickerProps {
    udc: UserDefineCategory;
    pressItemAction: (item: UserDefinedArchive) => void;
    cancelAction: () => void;
    currentItem: UserDefinedArchive;
    t: TFunction;
    theme: MD3Theme;
}

const UDAPicker = ({ udc, pressItemAction, cancelAction, currentItem, t }: UDAPickerProps) => {
    const theme = useTheme();
    const [docs, setDocs] = useState<UserDefinedArchive[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");
    const criteria = `udcid=${udc.id}`;

    const handleInitDocs = (allFlag = allOrRecent) => {
        let localDocs: UserDefinedArchive[] = [];
        if (allFlag === "all") {
            localDocs = UDARepo.queryData(criteria);
        } else {
            localDocs = UDARepo.queryRecent(criteria);
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

    // Actions after press UserDefineArchive item
    const handlePress = (item: UserDefinedArchive) => {
        if (allOrRecent === "all") {
            UDARepo.addRecent(item);
        }
        pressItemAction(item);
    };

    // Actions after long press UserDefineArchive item
    const handleLongPress = (item: UserDefinedArchive) => {
        if (allOrRecent === "recent") {
            UDARepo.deleteRecent(item);
            handleInitDocs();
        }
        return
    };

    // Refresh
    const handleDocRefresh = async () => {
        await UDARepo.initCache();
        handleInitDocs(allOrRecent);
    };


    const UDACard = ({ item }: { item: UserDefinedArchive }) => {
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
                    <Text style={{ width: "100%", padding: 2 }}>{t("udc")} : {item.udc.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("description")} : {item.description}</Text>
                </TouchableOpacity>
            </Card>
        );
    };



    return (
        <View style={{ flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("chooseUDA", { udcName: udc.name })}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList
                rows={docs}
                ItemElement={UDACard}
                rowsPerPage={10}
                searchFields={["code", "name", "description"]}
                sortFunction={(a, b) => a.id - b.id}
                refreshing={false}
            />

            <ScHandSwitch
                refreshDisplay={true}
                docRefresh={handleDocRefresh}
                cancelAction={cancelAction}
                theme={theme}
                t={t}
            />

        </View>
    );
};

export default UDAPicker;