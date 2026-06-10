import { Portal, Dialog, Text, Button } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { ScDetailProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const PersonDetail = ({ visible, currentItem, backAction, t, theme }: ScDetailProps<ScDataTypeList.Person>) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={backAction}>
                <Dialog.Title maxFontSizeMultiplier={1.2} style={{ color: theme.colors.primary }}>{t("detail")}</Dialog.Title>
                <Dialog.ScrollArea style={{ maxHeight: "75%" }} >
                    {currentItem === undefined || currentItem.id === 0
                        ? <View>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4}>{t("noData")}</Text>
                        </View>
                        : <ScrollView style={{ maxHeight: "100%" }}>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable style={{ padding: 2 }}>{t("code")} : {currentItem.code}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable style={{ padding: 2 }}>{t("name")} : {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable style={{ padding: 2 }}>{t("description")} : {currentItem.description}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable style={{ padding: 2 }}>{t("gender")}: {t(currentItem.gender === 0 ? "" : currentItem.gender === 1 ? "male" : "female")}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable style={{ padding: 2 }}>{t("subDept")}: {currentItem.deptName}</Text>
                        </ScrollView>
                    }
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={backAction}>{t("back")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default PersonDetail;