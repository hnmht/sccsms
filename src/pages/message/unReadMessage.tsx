import { useState } from "react";
import { FlatList, View, Alert } from "react-native";
import { Card, Text, useTheme, Button, IconButton } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";
import { dayjs } from "../../i18n/i18n";
import { DateTimeFormat } from "../../i18n/dayjs";
import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import { reqToReadMsg } from "../../api/message";
import { getDynamicMessages } from "../../store/pub";
import { CommentMessage } from "../../dataType/types/message";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { useTranslation } from "react-i18next";

const UnReadMessages = () => {
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const unReadMessages = useAppSelector(state => state.dynamicData.messages);
    const { t } = useTranslation();
    // Actions after Press read button
    const handleToReadMessage = async (msg: CommentMessage) => {
        setRefreshing(true);
        const res = await reqToReadMsg(msg);
        if (res.status) {
            Alert.alert(t("tip"), t("markedMessagesReadSuccessful"));
        }
        getDynamicMessages();
        setRefreshing(false);
    };
    // Actions after FlatList refreshing
    const handleRefreshUnMessages = () => {
        setRefreshing(true);
        getDynamicMessages();

        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: CommentMessage }) => {
        return (
            <Card style={{ margin: 4 }}>
                <Card.Title
                    title={item.creator.name}
                    subtitle={DateTimeFormat(item.createDate,"LLL")}
                    left={() => <PersonAvatar url={item.creator.avatar.fileUrl} name={item.creator.name} />}
                    titleMaxFontSizeMultiplier={1.5}
                    subtitleMaxFontSizeMultiplier={1.5}
                />
                <Card.Content>
                    <Text variant="bodyLarge" style={{ width: "100%", color: theme.colors.primary }}>{item.content}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("csa")} : {item.csaName}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("eoNumber")} : {item.billNumber}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("rowNumber")} : {item.rowNumber}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("epa")} : {item.epaName}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("executionValue")} : {item.executionValueDisp}</Text>
                    <View style={{ height: 68, marginTop: 8, width: "100%" }}>
                        <ScInput
                            dataType={ScDataTypeList.FileUpload}
                            isOnSitePhoto={false}
                            allowNull={true}
                            isEdit={false}
                            itemShowName={t("files")}
                            itemKey="edfiles"
                            initValue={item.eoFiles}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="edfiles"
                            positionID={0}
                            rowIndex={0}
                            errInfo={{ isErr: false, msg: "" }}
                        />
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button mode="text" onPress={() => handleToReadMessage(item)} loading={refreshing} disabled={refreshing} >{t("markAsRead")}</Button>
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ minHeight: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="bodyLarge" maxFontSizeMultiplier={1} style={{ padding: 4 }}>{`${t("count")}:${unReadMessages.length}`}</Text>
                <IconButton onPress={handleRefreshUnMessages} icon="refresh" iconColor={theme.colors.primary} />
            </View>
            <FlatList
                data={unReadMessages}
                renderItem={renderItem}
                keyExtractor={item => String(item.id)}
                refreshing={refreshing}
                onRefresh={handleRefreshUnMessages}
            />
        </View>
    );
};

export default UnReadMessages;