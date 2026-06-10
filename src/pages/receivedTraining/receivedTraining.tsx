import { useState, useMemo } from "react";
import { View, FlatList } from "react-native";
import { Card, Text, useTheme, Surface, Button, ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import { ScTableCell } from "../../components/ScTable";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { formatNumber } from "../../i18n/helper";

import { DateTimeFormat } from "../../i18n/dayjs";
import { reqGetReceivedTrainingReport } from "../../api/trainingRecord";
import { rtrQueryFields, generateRTRConditions } from "./constructor";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { Condition } from "../../dataType/types/queryPanel";
import { useTranslation } from "react-i18next";
import { ReceivedTrainingReport } from "../../dataType/types/trainingRecord";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { useAppSelector } from "../../store/hooks";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";


const examRes = ["unqualified", "qualified"];

function ReciveTraining() {
    const navigation = useBusinessNavigation();
    const theme = useTheme();
    const { t } = useTranslation();
    const [showQueryPanel, setShowQueryPanel] = useState<boolean>(false);
    const [conditions, setConditions] = useState<Condition[]>(generateRTRConditions());
    const [remoteDocs, setRemoteDocs] = useState<ReceivedTrainingReport[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    // Total
    const compuRes = useMemo(
        () => {
            let sumClasshour = 0;
            let countQualified = 0;
            let countDisqualification = 0;
            let sumExamineScore = 0;
            remoteDocs.forEach(row => {
                sumClasshour = sumClasshour + row.bClassHour;
                sumExamineScore = sumExamineScore + row.examScore;
                if (row.examRes === 0) {
                    countDisqualification++
                } else {
                    countQualified++
                }
            });

            return {
                sumClasshour: formatNumber(sumClasshour),
                countQualified,
                countDisqualification,
                averageExaminescore: formatNumber(sumExamineScore / remoteDocs.length),
            };
        },
        [remoteDocs],
    );

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

    // Reeuqest data from backend
    const handleReqDocReport = async (cons = conditions) => {
        setIsRefreshing(true);

        let queryString = transConditionsToString(cons);
        let docsRes = await reqGetReceivedTrainingReport({ queryString: queryString });
        let newDocs: ReceivedTrainingReport[] = [];
        if (docsRes.status) {
            newDocs = docsRes.data;
        }
        setRemoteDocs(newDocs);
        setIsRefreshing(false);
    };

    // what rows display in a Flatlist
    const TableRowCard = ({ item }: { item: ReceivedTrainingReport }) => {
        const doc = item;
        const index = item.bid;
        return (
            <Card key={`tableRowCard${doc.bid}`} style={{ marginTop: 2, marginBottom: 2 }}>
                <Card.Content key={`doccardcontent${doc.bid}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                    <ScTableCell title={"No."} content={index + 1} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"tcName"} content={doc.tcName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"studentName"} content={doc.studentName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"startTime"} content={DateTimeFormat(doc.startTime, "LLL")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"endTime"} content={DateTimeFormat(doc.endTime, "LLL")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"tcClassHour"} content={formatNumber(doc.bClassHour)} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"isExam"} content={t(doc.isExam === 0 ? "N" : "Y")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"examRes"} content={t(examRes[doc.examRes])} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"examScore"} content={formatNumber(doc.examScore)} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"studentPositionName"} content={doc.studentPositionName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"studentDeptName"} content={doc.studentDeptName} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"billNumber"} content={doc.billNumber} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"billDate"} content={DateTimeFormat(doc.billDate, "LL")} theme={theme} isEndCell={false} t={t} />
                    <ScTableCell title={"lecturerName"} content={doc.lecturerName} theme={theme} isEndCell={true} t={t} />
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title={"MenuTPS"} icon="google-classroom" theme={theme} t={t} />
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
                            : <>
                                <FlatList
                                    data={remoteDocs}
                                    renderItem={({ item }) => <TableRowCard item={item} />}
                                    keyExtractor={(item) => String(item.bid)}
                                />
                                <Card key={`tablefooter`} style={{ marginTop: 2, marginBottom: 8 }}>
                                    <Card.Content key={`tablefootercontent`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                                        <Text style={{ width: "50%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>{t("sum")} : {compuRes.sumClasshour}</Text>
                                        <Text style={{ width: "50%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>{t("avg")} : {compuRes.averageExaminescore}</Text>
                                        <Text style={{ width: "50%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>{t("qualified")} : {compuRes.countQualified}</Text>
                                        <Text style={{ width: "50%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>{t("unqualified")} : {compuRes.countDisqualification}</Text>
                                    </Card.Content>
                                </Card>
                            </>
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
                        queryFields={rtrQueryFields}
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

export default ReciveTraining;