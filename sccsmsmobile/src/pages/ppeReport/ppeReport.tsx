import { useState } from "react";
import { View, FlatList } from "react-native";
import { Card, Text, useTheme, Surface, Button, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import { ScTableCell } from "../../components/ScTable";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { DateTimeFormat } from "../../i18n/dayjs";
import { reqGetPPEIFReport } from "../../api/ppeIssuanceForm";
import { ppeIFRQueryFields, generatePPEIFRConditions } from "./constructor";
import { VoucherStatus } from "../../constant/voucherStatus";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { Condition } from "../../dataType/types/queryPanel";
import { PPEIssuanceFormReport } from "../../dataType/types/ppeIssuanceForm";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";
import { formatNumber } from "../../i18n/helper";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

function PPEReport() {
    const navigation = useBusinessNavigation();
    const theme = useTheme();
    const { t } = useTranslation();
    const [showQueryPanel, setShowQueryPanel] = useState<boolean>(false);
    const [conditions, setConditions] = useState<Condition[]>(generatePPEIFRConditions());
    const [remoteDocs, setRemoteDocs] = useState<PPEIssuanceFormReport[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    // Command button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);

    const handleGoBack = () => {
        navigation.goBack();
    };
    // Actions after press ok in QueryPanel
    const handleGetConditions = (value: Condition[]) => {
        setShowQueryPanel(false);
        setConditions(value);
        // Request data from backend
        handleReqDocReport(value);
    };

    // Request data from backend
    const handleReqDocReport = async (cons = conditions) => {
        setIsRefreshing(true);
        let queryString = transConditionsToString(cons);
        let docsRes = await reqGetPPEIFReport({ queryString: queryString });
        let newDocs: PPEIssuanceFormReport[] = [];
        if (docsRes.status) {
            newDocs = docsRes.data;
        }
        setRemoteDocs(newDocs);
        setIsRefreshing(false);
    };

    // What rows display in the Flatlist
    const TableRowCard = ({ item }: { item: PPEIssuanceFormReport }) => {
        const doc = item;
        const index = item.bid;
        return (
            <Card key={`tableRowCard${doc.bid}`} style={{ marginTop: 2, marginBottom: 2 }}>
                <Card.Content key={`doccardcontent${doc.bid}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                    <ScTableCell title={"No."} content={index + 1} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"recipientName"} content={doc.recipientName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"recipientPoisitionName"} content={doc.recipientPoisitionName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"recipientDeptName"} content={doc.recipientDeptName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"ppeCode"} content={doc.ppeCode} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"ppeName"} content={doc.ppeName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"ppeModel"} content={doc.ppeModel} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"ppeUnit"} content={doc.ppeUnit} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"quantity"} content={formatNumber(doc.quantity)} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"bDescription"} content={doc.bDescription} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"billNumber"} content={doc.billNumber} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"billDate"} content={DateTimeFormat(doc.billDate, "LL")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"issuingDeptName"} content={doc.issuingDeptName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"period"} content={t(doc.period)} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"startDate"} content={DateTimeFormat(doc.startDate, "LL")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"endDate"} content={DateTimeFormat(doc.endDate, "LL")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"creatorName"} content={doc.creatorName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"hStatus"} content={VoucherStatus[doc.hStatus]} theme={theme} isEndCell={true} t={t} />
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title={"MenuPPES"} icon="face-mask-outline" theme={theme} t={t} />
            <View style={{ flex: 1 }} id="document-content-display-area">
                <View style={{ flex: 1 }}>
                    {isRefreshing
                        ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                            <ActivityIndicator animating={true} size="small" />
                        </View>
                        : remoteDocs.length === 0
                            ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                                <Text variant="bodyMedium">{t("noData")}</Text>
                            </View>
                            : <FlatList
                                data={remoteDocs}
                                renderItem={({ item }) => <TableRowCard item={item} />}
                                keyExtractor={(item) => String(item.bid)}
                            />
                    }
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
                        queryFields={ppeIFRQueryFields}
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

export default PPEReport;