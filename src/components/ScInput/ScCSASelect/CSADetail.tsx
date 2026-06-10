import { Portal, Dialog, Text, Button } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { useAppSelector } from "../../../store/hooks";
import { ScDetailProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const CSADetail = ({ visible, currentItem, backAction, t,theme }: ScDetailProps<ScDataTypeList.ConstructionSite>) => {
    const csos = useAppSelector(state => state.dynamicData.csos);
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
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("category")} : {currentItem.csc.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("code")} : {currentItem.code}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("name")} : {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("description")}: {currentItem.description}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("subDept")} : {currentItem.subDept.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("respDept")} : {currentItem.respDept.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("respPerson")} : {currentItem.respPerson.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("longitude")}: {currentItem.longitude}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("latitude")}: {currentItem.latitude}</Text>
                            {csos.map(cso => {
                                return cso.enable === 1
                                    ? <Text maxFontSizeMultiplier={1.4} key={cso.id} selectable>{cso.displayName}:{(currentItem as any)[cso.code]?.name}</Text>
                                    : null
                            })}
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

export default CSADetail;