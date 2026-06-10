import { useState, useMemo } from "react";
import { View, FlatList } from "react-native";
import { Text, Card, useTheme, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { DateTimeFormat } from "../../i18n/dayjs";
import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { generateMSGQueryFields, generateMsgDefaultCons } from "./constructor";
import { reqReadComments } from "../../api/message";
import { CommentMessage } from "../../dataType/types/message";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { Condition } from "../../dataType/types/queryPanel";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";

const ReadMessage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [conditions, setConditions] = useState(generateMsgDefaultCons());
    const [readMsgs, setReadMsgs] = useState([]);
    const queryFields = useMemo(generateMSGQueryFields, []);
    const theme = useTheme();
    const { t } = useTranslation();

    const handleGetValue = (value: Condition[]) => {
        setShowDialog(false);
        setConditions(value);
        // Request Messages from backend server
        handleReqReadMsgs(value);
    };
    // Request Message from backend server
    const handleReqReadMsgs = async (cons: Condition[] = conditions) => {
        let queryString = transConditionsToString(cons);
        let res = await reqReadComments({ queryString: queryString });
        let newRows = [];
        if (res.status) {
            newRows = res.data;
        }
        setReadMsgs(newRows);

    };
    const renderItem = ({ item }: { item: CommentMessage }) => {
        return (
            <Card style={{ margin: 8 }}>
                <Card.Title
                    title={item.creator.name}
                    subtitle={DateTimeFormat(item.createDate, "LLL")}
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
                    <View style={{ height: 68, margin: 8, width: "100%" }}>
                        <ScInput
                            dataType={ScDataTypeList.FileUpload}
                            isOnSitePhoto={false}
                            allowNull={true}
                            isEdit={false}
                            itemShowName={t("files")}
                            itemKey="eoFiles"
                            initValue={item.eoFiles}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="eoFiles"
                            positionID={0}
                            rowIndex={0}
                            errInfo={{ isErr: false, msg: "" }}
                        />
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ minHeight: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="bodyLarge" maxFontSizeMultiplier={1} style={{ padding: 4 }}>{`${t("count")}:${readMsgs.length}`}</Text>
                <IconButton onPress={() => setShowDialog(true)} icon="filter-variant" iconColor={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={readMsgs}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    refreshing={false}
                    onRefresh={handleReqReadMsgs}
                />
            </View>
            <ScComponentModal
                visible={showDialog}
            >
                <QueryPanel
                    onCancel={() => setShowDialog(false)}
                    title={t("messagesFilterCondition")}
                    queryFields={queryFields}
                    initalConditions={conditions}
                    onOk={handleGetValue}
                />
            </ScComponentModal>
        </View>
    );
};

export default ReadMessage;