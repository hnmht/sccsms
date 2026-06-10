import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Button, Card, IconButton, useTheme, Surface } from "react-native-paper";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import DocList from "../../components/DocList/DocList";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import WOCardContent from "./WOCardContent";
import { reqGetWOList, reqGetWODetail, reqConfirmWO, reqCancelConfirmWO, reqDeleteWO } from "../../api/workOrder";
import { generateConditions, queryFields, wosSortByid } from "./constructor";
import { transWoDetailToFronted } from "../workOrder/constructor";
import { WorkOrder } from "../../dataType/types/workOrder";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";
import { Condition } from "../../dataType/types/queryPanel";

const RemoteWorkOrderList = () => {
    const navigation = useBusinessNavigation();
    const [remoteWOs, setRemoteWOs] = useState<WorkOrder[]>([]);
    const [showQueryPanel, setShowQueryPanel] = useState(false);
    const [conditions, setConditions] = useState(generateConditions());
    const theme = useTheme();
    const { t } = useTranslation();
    const user = useAppSelector(state => state.user);
    // Commands button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);

    useEffect(() => {
        handleReqWOs(conditions);
    }, []);

    // Actions after get Query Condition
    const handleGetConditions = (value: Condition[]) => {
        setShowQueryPanel(false);
        setConditions(value);
        // Request Work Order List from backend
        handleReqWOs(value);
    };

    // Request Work Order List from backend
    const handleReqWOs = async (cons = conditions) => {
        // Convert query criteria  to string
        let queryString = transConditionsToString(cons);
        // Request Work Order List from backend
        let wosRes = await reqGetWOList({ queryString: queryString });
        let newWos: WorkOrder[] = [];
        if (wosRes.status) {
            newWos = wosRes.data;
        }
        setRemoteWOs(newWos);
    };

    // Actions On EditWorkOrder Page goBack
    const handleOnGoBack = (shouldRefresh: boolean = false) => {
        if (shouldRefresh) {
            handleReqWOs();
        }
    }

    // Actions after press add button 
    const handleAddWO = () => {
        navigation.navigate("WorkOrder", { isLocal: false, isNew: true, isModify: false, oriWO: undefined, onGoBack: handleOnGoBack });
    };
    // Actions after press detail button
    const handleViewAction = async (item: WorkOrder) => {
        // Request Work Order Detail from backend
        let res = await reqGetWODetail(item);
        if (res.status) {
            let woDetail = transWoDetailToFronted(res.data);
            navigation.navigate("WorkOrder", { isLocal: false, isNew: false, isModify: false, oriWO: woDetail, onGoBack: handleOnGoBack });
        } else {
            return
        }
    };
    // Actions after press copy add button
    const handleCopyAdd = async (item: WorkOrder) => {
        // Request work order detail from backend
        let res = await reqGetWODetail(item);
        if (res.status) {
            let woDetail = transWoDetailToFronted(res.data);
            navigation.navigate("WorkOrder", { isLocal: false, isNew: true, isModify: false, oriWO: woDetail, onGoBack: handleOnGoBack });
        } else {
            return
        }
    };

    // Actions after press edit button
    const handleEditAction = async (item: WorkOrder) => {
        let res = await reqGetWODetail(item);
        if (res.status) {
            let woDetail = transWoDetailToFronted(res.data);
            navigation.navigate("WorkOrder", { isLocal: false, isNew: false, isModify: true, oriWO: woDetail, onGoBack: handleOnGoBack });
        } else {
            return
        }
    };
    // Actions after press confirm button
    const handleConfirm = async (item: WorkOrder) => {
        let res = await reqConfirmWO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("confirmSuccessful"));
        }
        // Refresh work order list
        handleReqWOs();

    };

    // Actions after press unconfirm button
    const handleCancelConfirm = async (item: WorkOrder) => {
        let res = await reqCancelConfirmWO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("unconfirmSuccessful"));
        }
        // Refresh work order list
        handleReqWOs();
    };

    // Actions after press delete button
    const handleDelete = async (item: WorkOrder) => {
        let res = await reqDeleteWO(item);
        if (res.status) {
            Alert.alert(t("tip"), t("deleteSuccessful"));
        }
        // Refresh work order list
        handleReqWOs();
    };

    const WOCard = ({ item }: { item: WorkOrder }) => {
        const wo = item;
        const delDisable = !(wo.status === 0 && wo.creator.id === user.id);
        const editDisable = !(wo.status === 0 && wo.creator.id === user.id);
        const startDisable = !(wo.status === 0);
        const stopDisable = !(wo.status === 1 && wo.confirmer.id === user.id);
        return (
            <Card key={wo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <WOCardContent wo={wo} isLocal={false} theme={theme} t={t} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="cancelConfirm" onPress={() => handleCancelConfirm(wo)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(wo)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="delete" onPress={() => handleDelete(wo)} icon="delete-outline" disabled={delDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEditAction(wo)} icon="pencil-outline" disabled={editDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="copyAdd" onPress={() => handleCopyAdd(wo)} icon="plus-box-multiple-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(wo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={remoteWOs}
                    ItemElement={WOCard}
                    rowsPerPage={10}
                    searchFields={["billDate", "billNumber", "creator.name", "department.name"]}
                    sortFunction={wosSortByid}
                    refreshing={false}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <Button icon="plus" onPress={handleAddWO}>{t("add")}</Button>
                <Button onPress={() => setShowQueryPanel(true)} icon="filter-variant">{t("filter")}</Button>
            </Surface>
            <ScComponentModal
                visible={showQueryPanel}
            >
                <QueryPanel
                    onCancel={() => setShowQueryPanel(false)}
                    title="queryConditions"
                    queryFields={queryFields}
                    initalConditions={conditions}
                    onOk={handleGetConditions}
                />
            </ScComponentModal>
        </View>
    );
};

export default RemoteWorkOrderList;