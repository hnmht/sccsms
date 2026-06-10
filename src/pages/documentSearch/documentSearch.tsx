import { useState } from "react";
import { View } from "react-native";
import { Card, Text, useTheme, Surface, Button } from "react-native-paper";
import { DateTimeFormat } from "../../i18n/dayjs";
import ScInput from "../../components/ScInput";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import DocList from "../../components/DocList/DocList";

import { reqGetDocReport } from "../../api/document";
import { documentQueryFields, generateDocumentConditions, sortByid } from "./constructor";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";
import { Condition } from "../../dataType/types/queryPanel";
import { QueryDocument } from "../../dataType/types/document";
import { SafeAreaView } from "react-native-safe-area-context";


const LookupDocument = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useBusinessNavigation();
    const [showQueryPanel, setShowQueryPanel] = useState(false);
    const [conditions, setConditions] = useState(generateDocumentConditions());
    const [remoteDocs, setRemoteDocs] = useState<QueryDocument[]>([]);

    // Command button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);

    const handleGoBack = () => {
        navigation.goBack();
    };
    // Actions after press ok in QueryPannel model
    const handleGetConditions = (value: Condition[]) => {
        setShowQueryPanel(false);
        setConditions(value);
        // Request data from backend
        handleReqDocReport(value);
    };

    // Request data from backend
    const handleReqDocReport = async (cons = conditions) => {
        let queryString = transConditionsToString(cons);
        let docsRes = await reqGetDocReport({ queryString: queryString });
        let newDocs: QueryDocument[] = [];
        if (docsRes.status) {
            newDocs = docsRes.data;
        }
        setRemoteDocs(newDocs);
    };


    const ResultDocCard = ({ item }: { item: QueryDocument }) => {
        const doc = item;
        return (
            <Card key={`docCard${doc.docID}`} style={{ marginTop: 2, marginBottom: 2 }}>
                <Card.Content key={`doccardcontent${doc.docID}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                    <Text variant="titleMedium" style={{ width: "100%", color: theme.colors.primary }}>{t("docName")} : {doc.docName}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("edition")} : {doc.edition}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("author")} : {doc.author}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("dcName")} : {doc.dcName}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("releaseDate")} : {DateTimeFormat(doc.releaseDate, "LL")}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("description")} : {doc.description}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("uploadDate")} : {DateTimeFormat(doc.uploadDate, "LLL")}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>{t("creatorName")} : {doc.creatorName}</Text>
                    <View style={{ height: 62, margin: 0, width: "100%", marginTop: 4 }}>
                        <ScInput
                            dataType={902}
                            isOnSitePhoto={false}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="files"
                            errInfo={{ isErr: false, msg: "" }}
                            itemKey="files"
                            initValue={doc.files}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="files"
                            positionID={1}
                            rowIndex={-1}
                        />
                    </View>
                </Card.Content>
            </Card>
        );
    };


    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title={"MenuDocumentFind"} icon="folder-open-outline" theme={theme} t={t} />
            <View style={{ flex: 1 }} id="document-content-display-area">
                <View style={{ flex: 1 }}>
                    <DocList
                        refreshing={false}
                        rows={remoteDocs}
                        ItemElement={ResultDocCard}
                        rowsPerPage={10}
                        searchFields={["docName", "dcName", "creatorName", "edition", "description", "author"]}
                        sortFunction={sortByid}
                    />
                </View>
                <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                    <Button onPress={() => setShowQueryPanel(true)} icon="filter-variant">{t("filter")}</Button>
                </Surface>
                <ScComponentModal
                    visible={showQueryPanel}
                >
                    <QueryPanel
                        onCancel={() => setShowQueryPanel(false)}
                        title={t("queryConditions")}
                        queryFields={documentQueryFields}
                        initalConditions={conditions}
                        onOk={handleGetConditions}
                    />
                </ScComponentModal>
            </View>
            <ScHandSwitch
                refreshDisplay={false}
                docRefresh={() => { }}
                cancelAction={handleGoBack}
                theme={theme}
                t={t}
            />
        </SafeAreaView>
    );
};

export default LookupDocument;