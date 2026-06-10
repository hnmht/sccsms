import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Button, Card, IconButton, Surface, MD3Theme } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";
import DocList from "../../components/DocList/DocList";
import WORefer from "./WORefer";
import EOCardContent from "./EOCardContent";

import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { reqGetEOList, reqGetEODetail, reqConfirmEO, reqUnConfirmEO, reqDeleteEO } from "../../api/executionOrder";
import { generateEOConditions, generateWOConditions, eoQueryFields, woQueryFields, eosSortByID, transEODetailToFronted } from "./constructor";
import { BusinessNavParamList } from "../../navigation/config/screenParams";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { Condition } from "../../dataType/types/queryPanel";
import { WorkOrderRow } from "../../dataType/types/workOrder";

import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";

interface EODiagStatus {
    isOpen: boolean;
    content: 0 | 1 | 2 | 3 | 4;//1 Edit EO 2 EO Filter Conditions 3 WO Selection 4 WO Filter Conditions
    selectedWOR: WorkOrderRow | undefined;
    selectedEO: ExecutionOrder | undefined;
    isNew: boolean;
    isModify: boolean;
}

interface RemoteEOListProps {
    t: TFunction;
    theme: MD3Theme;
    isOffline: boolean;
    navigation: NativeStackNavigationProp<BusinessNavParamList, keyof BusinessNavParamList>;
}


function RemoteExecutionOrderList({
    t,
    theme,
    isOffline,
    navigation,
}: RemoteEOListProps) {

    const [remoteEOs, setRemoteEOs] = useState<ExecutionOrder[]>([]);
    const [woConditions, setWoConditions] = useState<Condition[]>(generateWOConditions());
    const [eoConditions, setEoConditions] = useState<Condition[]>(generateEOConditions());
    const [diagStatus, setDiagStatus] = useState<EODiagStatus>({
        isOpen: false,
        content: 0,
        selectedWOR: undefined,
        selectedEO: undefined,
        isNew: false,
        isModify: false
    });
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const user = useAppSelector(state => state.user);
    // Command button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);

    useEffect(() => {
        handleReqEOs(eoConditions);
    }, []);

    // Close dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Request EO list from server based on conditions
    const handleReqEOs = async (cons = eoConditions) => {
        setRefreshing(true);
        // Convert conditions to query string
        let queryString = transConditionsToString(cons);
        let eosRes = await reqGetEOList({ queryString: queryString });
        let newEos: ExecutionOrder[] = [];
        if (eosRes.status) {
            newEos = eosRes.data;
        }
        setRemoteEOs(newEos);
        setRefreshing(false);
    };
    // Actions after press the query button
    const handlePressQuery = () => {
        setDiagStatus({
            isOpen: true,
            content: 2,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after press ok button in EO filter conditions dialog
    const handleEOQueryOk = (value: Condition[] = eoConditions) => {
        setEoConditions(value);
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
        // Request EO list with new conditions
        handleReqEOs(value);
    };

    // Actions after press Add Ref button
    const handleAddRef = () => {
        setDiagStatus({
            isOpen: true,
            content: 4,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };

    // Actions after press ok button in WO filter conditions dialog
    const handleWoQueryOk = (cons: Condition[] = woConditions) => {
        setWoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3,
            selectedWOR: undefined,
            selectedEO: undefined,
            isNew: false,
            isModify: false
        });
    };
    // Actions after select a WO in WO selection dialog
    const handleWoReferOk = (item: WorkOrderRow) => {
        setDiagStatus({
            isOpen: false,
            content: 0,
            selectedWOR: item,
            selectedEO: undefined,
            isNew: true,
            isModify: false
        });
        // Navigate to EO edit page with the selected WO as reference
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: item, oriEO: undefined, onGoBack: () => handleReqEOs() });
    };

    // Actions after press the add button
    const handleAdd = () => {
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: undefined, oriEO: undefined, onGoBack: () => handleReqEOs() });
    };
    // Actions after press the view detail button in EO card
    const handleViewAction = async (item: ExecutionOrder) => {
        let res = await reqGetEODetail(item);
        if (res.status) {
            let eoDetail = transEODetailToFronted(res.data);
            navigation.navigate("ExecutionOrder", { isLocal: false, isNew: false, isModify: false, oriWOR: undefined, oriEO: eoDetail, onGoBack: () => { } });
        }
    };

    // Actions after press the edit button in EO card
    const handleEditAction = async (item: ExecutionOrder) => {
        let res = await reqGetEODetail(item);
        if (res.status) {
            let eoDetail = transEODetailToFronted(res.data);
            navigation.navigate("ExecutionOrder", { isLocal: false, isNew: false, isModify: true, oriWOR: undefined, oriEO: eoDetail, onGoBack: () => handleReqEOs() });

        } else {

            return
        }
    };
    // Actions after press the confirm button in EO card
    const handleConfirm = async (item: ExecutionOrder) => {
        let res = await reqConfirmEO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("confirmSuccessful"));
        } else {
            return
        }
        // refresh EO list
        handleReqEOs();
    };

    // Actions after press the cancel confirm button in EO card
    const handleUnConfirm = async (item: ExecutionOrder) => {
        const res = await reqUnConfirmEO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("unconfirmSuccessful"));
        } else {
            return;
        }
        // refresh EO list
        handleReqEOs();
    };

    // Actions after press the delete button in EO card
    const handleDelete = async (item: ExecutionOrder) => {
        const res = await reqDeleteEO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("deleteSuccessful"));
        } else {
            return;
        }
        // Refresh EO list
        handleReqEOs();
    };

    // Content of the dialog, which is decided by diagStatus.content
    const DiagContent = ({ status }: { status: EODiagStatus }) => {
        const content = status.content;
        switch (content) {
            case 1:
                return null;
            case 2:
                return <QueryPanel
                    title="eoFilterCondition"
                    queryFields={eoQueryFields}
                    initalConditions={eoConditions}
                    onOk={handleEOQueryOk}
                    onCancel={handleDiagClose}
                />;
            case 3:
                return <WORefer
                    isOffline={isOffline}
                    filterButtonDisp={true}
                    title={"generateRefWO"}
                    conditions={woConditions}
                    cancelPressAction={handleDiagClose}
                    okPressAction={handleWoReferOk}
                    filterAction={handleAddRef}
                    theme={theme}
                    t={t}
                />;
            case 4:
                return <QueryPanel
                    title="woFilterCondition"
                    queryFields={woQueryFields}
                    initalConditions={woConditions}
                    onOk={handleWoQueryOk}
                    onCancel={handleDiagClose}
                />;
            default:
                return null;
        }
    };

    const EOCard = ({ item }: { item: ExecutionOrder }) => {
        const eo = item;
        const delDisable = !(eo.status === 0 && eo.creator.id === user.id);
        const editDisable = !(eo.status === 0 && eo.creator.id === user.id);
        const startDisable = !(eo.status === 0);
        const stopDisable = !(eo.status === 1 && eo.confirmer.id === user.id);
        return (
            <Card key={eo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <EOCardContent eo={eo} isLocal={false} t={t} theme={theme} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="cancelConfirm" onPress={() => handleUnConfirm(eo)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(eo)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="delete" onPress={() => handleDelete(eo)} icon="delete-outline" disabled={delDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEditAction(eo)} icon="pencil-outline" disabled={editDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(eo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={remoteEOs}
                    ItemElement={EOCard}
                    rowsPerPage={10}
                    searchFields={["billDate", "billNumber", "creator.name", "department.name", "csa.name", "ept.name", "startTime", "description"]}
                    sortFunction={eosSortByID}
                    refreshing={refreshing}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton icon="plus" iconColor={theme.colors.primary} onPress={handleAdd} />
                <Button icon="link-plus" textColor={theme.colors.primary} onPress={handleAddRef}>{t("addReference")}</Button>
                <Button onPress={handlePressQuery} icon="filter-variant">{t("filter")}</Button>
            </Surface>
            <ScComponentModal
                visible={diagStatus.isOpen}
            >
                <DiagContent status={diagStatus} />
            </ScComponentModal>
        </View>
    );
};

export default RemoteExecutionOrderList;