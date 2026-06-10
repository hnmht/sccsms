import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Button, Card, Text, IconButton, useTheme, Surface } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { dayjs } from "../../i18n/dayjs";
import ScFunctionTitle from "../../components/ScFunctionTitle/ScFunctionTitle";
import DocListPaging from "../../components/DocList/DocListPaging";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";

import { VoucherStatus } from "../../constant/voucherStatus";
import { reqGetEOPaginationList, reqGetEODetail, reqConfirmEO, reqUnConfirmEO } from "../../api/executionOrder";
import { transEODetailToFronted } from "../executionOrderList/constructor";
import { generateEOConditions } from "./constructor";
import { eoQueryFields } from "../executionOrderList/constructor";
import { useAppSelector } from "../../store/hooks";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { EOListPaging, ExecutionOrder } from "../../dataType/types/executionOrder";
import { Condition } from "../../dataType/types/queryPanel";
import { useTranslation } from "react-i18next";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";

function ExecutionOrderReviewList() {
    const navigation = useBusinessNavigation();
    const [eosPaging, setEosPaging] = useState<EOListPaging>({ eos: [], count: 0, page: 0, perPage: 10 });
    const [page, setPage] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(5);
    const [eoConditions, setEoConditions] = useState<Condition[]>(generateEOConditions());
    const [diagStatus, setDiagStatus] = useState({ isOpen: false });
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [refreshFlag, setRefreshFlag] = useState<boolean>(true);
    const theme = useTheme();
    const { t } = useTranslation()
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        handleReqEOs(eoConditions);
    }, [page, eoConditions, refreshFlag]);

    // Command button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);

    const handleGoBack = () => {
        navigation.goBack();
    };

    // Close query condition dialog
    const handleDiagClose = () => {
        setDiagStatus({ isOpen: false });
    };

    // Request execution orders based on query conditions
    const handleReqEOs = async (cons = eoConditions) => {
        setRefreshing(true);
        // Convert conditions to query string
        let queryString = transConditionsToString(cons);
        let edsRes = await reqGetEOPaginationList({ queryString: queryString, page: page, perPage: perPage });
        let newEos: EOListPaging = { eos: [], count: 0, page: 0, perPage: 5 };
        if (edsRes.status) {
            newEos = edsRes.data;
        }
        setPage(newEos.page);
        setEosPaging(newEos);
        setRefreshing(false);
    };
    // Actions after press filter button to open query condition dialog
    const handlePressQuery = () => {
        setDiagStatus({ isOpen: true });
    };

    // Actions after press ok button in the query panel dialog
    const handleEOQueryOk = (value: Condition[] = eoConditions) => {
        setEoConditions(value);
        setPage(0);
        setRefreshFlag(!refreshFlag);
        setDiagStatus({ isOpen: false });
    };

    // Actions after press detail button in the EOCard
    const handleViewAction = async (item: ExecutionOrder) => {
        let res = await reqGetEODetail(item);
        if (res.status) {
            let edDetail = transEODetailToFronted(res.data);
            navigation.navigate("ExecutionOrderReview",
                {
                    isLocal: false,
                    isNew: false,
                    isModify: false,
                    oriWOR: undefined,
                    oriEO: edDetail,
                    startTime: dayjs().toISOString(),
                    onGoBack: () => setRefreshFlag(!refreshFlag)
                });
        }
    };

    // Actions after press confirm button in the EO card
    const handleConfirm = async (item: ExecutionOrder) => {
        let res = await reqConfirmEO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("confirmSuccessful"));
        } else {
            return
        }
        // Refresh EO list
        setRefreshFlag(!refreshFlag);
    };

    // Actions after press unConfirm button in the EO Card
    const handleUnConfirm = async (item: ExecutionOrder) => {
        let res = await reqUnConfirmEO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("unconfirmSuccessful"));
        } else {
            return
        }
        // Refresh EO list
        setRefreshFlag(!refreshFlag);
    };
    // Execution Order Card display content
    const EOCard = ({ item }: { item: ExecutionOrder }) => {
        const eo = item;
        const startDisable = !(eo.status === 0);
        const stopDisable = !(eo.status === 1 && eo.confirmer.id === user.id);
        return (
            <Card key={eo.id} style={{ marginTop: 4, marginBottom: 4 }}>
                <Card.Content key={`cardcontent${eo.id}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("billNumber")} : {eo.billNumber}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("billDate")}: {dayjs(eo.billDate).format("YYYY-MM-DD")}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("csa")} : {eo.csa.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("ept")} : {eo.ept.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("startTime")} : {dayjs(eo.startTime).format("YYYY-MM-DD HH:mm")}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("endTime")} : {dayjs(eo.endTime).format("YYYY-MM-DD HH:mm")}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("status")} : {VoucherStatus[eo.status]}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("executor")} :{eo.creator.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("department")} :{eo.department.name}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("description")} :{eo.description}</Text>
                    <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceType")} : {eo.sourceType}</Text>
                    {eo.sourceType !== "UA"
                        ? <>
                            <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceBillNumber")} : {eo.sourceBillNumber}</Text>
                            <Text variant="titleMedium" style={{ width: "100%" }}>{t("sourceRowNumber")} : {eo.sourceRowNumber}</Text>
                        </>
                        : null
                    }
                    <Text variant="titleMedium" style={{ width: "100%", color: eo.issueNumber > 0 ? theme.colors.error : theme.colors.onSurface }}>{t("issueNumber")}: {eo.issueNumber}</Text>
                    {eo.reviewedNumber > 0
                        ? <>
                            <Text variant="titleMedium" style={{ width: "100%", color: "green" }}>{t("reviewRecords")} : {t("timesAndSeconds", { times: eo.reviewedNumber, seconds: eo.reviewedSeconds })}</Text>
                        </>
                        : null
                    }
                </Card.Content>
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", }}>
                    <IconButton key="cancelConfirm" onPress={() => handleUnConfirm(eo)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(eo)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(eo)} icon="text-search" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScFunctionTitle title={t("MenuEOReview")} icon="clipboard-text-search" theme={theme} t={t} />
            <View style={{ flex: 1, paddingTop: 8 }}>
                <DocListPaging
                    rows={eosPaging.eos}
                    ItemElement={EOCard}
                    refreshing={refreshing}
                    rowCount={eosPaging.count}
                    rowsPerPage={perPage}
                    page={page}
                    pageChangeAction={(page) => setPage(page)}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <Button onPress={handlePressQuery} icon="filter-variant">{t("filter")}</Button>
            </Surface>
            <ScComponentModal
                visible={diagStatus.isOpen}
            >
                <QueryPanel
                    title="eoFilterCondition"
                    queryFields={eoQueryFields}
                    initalConditions={eoConditions}
                    onOk={handleEOQueryOk}
                    onCancel={handleDiagClose}
                />
            </ScComponentModal>
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

export default ExecutionOrderReviewList;