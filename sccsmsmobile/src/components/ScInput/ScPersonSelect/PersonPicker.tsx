import { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import ScHandSwitch from "../../ScHandSwitch/ScHandSwitch";
import DocList from "../../DocList/DocList";
import { Person } from "../../../dataType/types/person";
import { personRepo } from "../../../db/crud/person";
import ScSegmentAllOrRecent from "../../ScSegmentAllOrRecent/ScSegmentAllOrRecent";
import { ScPickerProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const PersonPicker = ({ t, cancelAction, pressItemAction, currentItem, theme }: ScPickerProps<ScDataTypeList.Person>) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [allOrRecent, setAllOrRecent] = useState<"recent" | "all">("recent");

    const handleInitPersons = (allFlag = allOrRecent) => {
        let localPersons = [];
        if (allFlag === "all") {
            localPersons = personRepo.getAllData();
        } else {
            localPersons = personRepo.getRecent();
        }
        setPersons(localPersons);
    };

    useEffect(() => {
        handleInitPersons();
    }, []);

    // Switch SegmentedButtons
    const handleChangeSeg = (value: "recent" | "all") => {
        setAllOrRecent(value);
        handleInitPersons(value);
    };

    // Actions after press Person item
    const handlePersonPress = (item: Person) => {
        if (allOrRecent === "all") {
            personRepo.addRecent(item);
        }
        pressItemAction(item);
    };
    // Refresh persons
    const handlePersonRefresh = async () => {
        await personRepo.initCache();
        handleInitPersons(allOrRecent);
    };
    // Remove the item from "Recents" after a long press
    const handleLongPress = (item: Person) => {
        if (allOrRecent === "recent") {
            personRepo.deleteRecent(item);
            handleInitPersons();
        }
        return
    };

    const PersonCard = ({ item }: { item: Person }) => {
        return (
            <Card key={item.id} style={{ marginTop: 4, marginBottom: 4 }}>
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        margin: 4,
                    }}
                    onPress={() => handlePersonPress(item)}
                    onLongPress={() => handleLongPress(item)}
                >
                    <Text style={{ width: "100%", padding: 2, fontWeight: "bold", color: item.status === 1 ? "red" : theme.colors.onBackground }}>{t("name")} : {item.name}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("code")} : {item.code}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("subDept")} : {item.deptName}</Text>
                    <Text style={{ width: "100%", padding: 2 }}>{t("mobile")} : {item.mobile}</Text>
                    <Text style={{ width: "50%", padding: 2 }}>{t("gender")} : {t(item.gender === 0 ? "" : item.gender === 1 ? "male" : "female")}</Text>
                    <Text style={{ width: "50%", padding: 2 }}>{t("status")} : {t(item.status === 0 ? "normal" : "disable")}</Text>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <ScSegmentAllOrRecent
                title={t("choosePerson")}
                allOrRecent={allOrRecent}
                setAllOrRecent={handleChangeSeg}
                theme={theme}
                t={t}
            />
            <DocList<Person>
                rows={persons}
                ItemElement={PersonCard}
                rowsPerPage={10}
                searchFields={["code", "name", "deptname", "mobile"]}
                sortFunction={(a: Person, b: Person) => a.name.localeCompare(b.name)}
                refreshing={false}
            />
            <ScHandSwitch
                refreshDisplay={true}
                cancelAction={cancelAction}
                docRefresh={handlePersonRefresh}
                theme={theme}
                t={t}
            />
        </View>
    );
};

export default PersonPicker;