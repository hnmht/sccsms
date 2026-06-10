import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Card, Text, TextInput, useTheme } from "react-native-paper";
import { cloneDeep } from "lodash"
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import Icon from '@react-native-vector-icons/material-design-icons';
import { matchSorter } from "match-sorter";
import { reqGetPersons } from "../../api/person";

import { useAppSelector } from "../../store/hooks";
import { Person } from "../../dataType/types/person";
import { personRepo } from "../../db/crud/person";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { useTranslation } from "react-i18next";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { SafeAreaView } from "react-native-safe-area-context";

const searchFields = ["code", "name", "deptName", "mobile", "email", "description"];

function AddressBook() {
    const theme = useTheme();
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const [keyWord, setKeyWord] = useState("");
    const [persons, setPersons] = useState<Person[]>([]);
    const { t } = useTranslation();
    const navigation = useBusinessNavigation();
    const filteredPersons = matchSorter(persons, keyWord, { keys: searchFields });

    useEffect(() => {
        async function getPersons() {
            let newPersons: Person[] = persons;
            if (isOffLine === 0) {
                let res = await reqGetPersons();
                if (res.status) {
                    newPersons = res.data;
                    await personRepo.initCache();
                }
            } else {
                newPersons = personRepo.getAllData();
            }
            setPersons(newPersons);
        }
        getPersons();
    }, [isOffLine]);

    // Refresh persons
    const handlePersonRefresh = async () => {
        let newPersons: Person[] = persons;
        let res = await reqGetPersons();
        if (res.status) {
            newPersons = res.data;
        } else {
            newPersons = cloneDeep(persons);
        }
        setPersons(newPersons);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View >
                <View style={{
                    padding: 2,
                    height: 60,
                    width: "100%",
                }}>
                    <TextInput
                        mode="outlined"
                        value={keyWord}
                        onChangeText={(text) => setKeyWord(text)}
                        left={<TextInput.Icon icon="text-search" color={theme.colors.primary} />}
                        right={keyWord !== "" ? <TextInput.Icon icon="close" color={theme.colors.primary} onPress={() => setKeyWord("")} /> : null}
                        placeholder={t("enterToSearch")}
                        dense
                    />
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {filteredPersons
                    .sort((a: Person, b: Person) => a.name.localeCompare(b.name))
                    .map(person => {
                        return (person.status === 0
                            ? <Card key={person.id} style={{ marginTop: 2, marginBottom: 2 }}>
                                <Card.Title
                                    title={person.name}
                                    subtitle={person.deptName}
                                    left={() => <PersonAvatar key={`cardTItleAvatar${person.id}`} url={person.avatar.fileUrl} name={person.name} />}
                                    key={`cardTitle${person.id}`}
                                />
                                <Card.Content>
                                    <View style={{ flexDirection: "row", alignItems: "center", margin: 4 }} >
                                        <Icon name="cellphone" size={32} color={theme.colors.primary} style={{ marginRight: 10 }} />
                                        <Text variant="bodyLarge" selectable>{person.mobile}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", margin: 4 }}>
                                        <Icon name="email-outline" size={32} color={theme.colors.primary} style={{ marginRight: 10 }} />
                                        <Text variant="bodyLarge" selectable>{person.email}</Text>
                                    </View>
                                    <View style={{ margin: 4 }} >
                                        <Text>{person.description}</Text>
                                    </View>
                                </Card.Content>
                            </Card>
                            : null
                        )
                    })}
            </ScrollView>
            <ScHandSwitch
                refreshDisplay={true}
                theme={theme}
                t={t}
                docRefresh={handlePersonRefresh}
                cancelAction={() => navigation.goBack()}
            />
        </SafeAreaView>
    );
};

export default AddressBook;