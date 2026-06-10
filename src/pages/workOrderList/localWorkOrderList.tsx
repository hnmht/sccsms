import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { IconButton, useTheme, Card, Button, Surface } from "react-native-paper";
import { cloneDeep } from "lodash";
import DocList from "../../components/DocList/DocList";
import WOCardContent from "./WOCardContent";
import { wosSortByid } from "./constructor";
import { reqAddWO } from "../../api/workOrder";
import { transWOToBackend } from "../workOrder/constructor";
import { WorkOrder } from "../../dataType/types/workOrder";
import { useBusinessNavigation } from "../../navigation/config/screenParams";
import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { WORepo } from "../../db/crud/workorder";

function LocalWorkOrderList() {
    const navigation = useBusinessNavigation();
    const [localWOs, setLocalWOs] = useState<WorkOrder[]>([]);
    const user = useAppSelector(state => state.user);
    const appInfo = useAppSelector(state => state.appInfo);
    const isOffLine = appInfo.isOffline === 1;
    const { t } = useTranslation();
    const theme = useTheme();
    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    // Get local Work order list
    const handleGetLocalWOs = () => {
        let newWos = WORepo.getUserVouchers(user.id);
        setLocalWOs(newWos);
    };
    useEffect(() => {
        handleGetLocalWOs();
    }, []);
    // Actions on EditWorkOrder Page goBack
    const handleGoBack = (shouldRefresh: boolean = false) => {
        if (shouldRefresh) {
            handleGetLocalWOs();
        }
    };
    // Actions after press add button
    const handleAdd = () => {
        navigation.navigate("WorkOrder", { isLocal: false, isNew: true, isModify: false, oriWO: undefined, onGoBack: handleGoBack });
    };
    // Actions after press delete button
    const handleDelete = (item: WorkOrder) => {
        // Delete local Work Order
        WORepo.delVoucher(item)
        // Refresh Local Work order list
        handleGetLocalWOs();
    };
    // Actions after press edit button
    const handleEdit = (item: WorkOrder) => {
        navigation.navigate("WorkOrder", { isLocal: true, isNew: false, isModify: true, oriWO: item, onGoBack: handleGoBack });
    };
    // Actions after press copy add button
    const handleCopyAdd = (item: WorkOrder) => {
        navigation.navigate("WorkOrder", { isLocal: false, isNew: true, isModify: false, oriWO: item, onGoBack: handleGoBack });
    };
    // Actions after press detail button
    const handleDetail = (item: WorkOrder) => {
        navigation.navigate("WorkOrder", { isLocal: true, isNew: false, isModify: false, oriWO: item, onGoBack: handleGoBack });
    };
    // Actions after press upload button
    const handleUpload = async (item: WorkOrder) => {
        let newWO = cloneDeep(item);
        //Convert Work Order to backend format
        const thisWO = transWOToBackend(newWO);
        thisWO.id = 0
        let addRes = await reqAddWO(thisWO);
        if (addRes.status) {
            WORepo.delVoucher(item);
            Alert.alert(t("tip"), t("successful"));
        }
        // Refresh local work order list
        handleGetLocalWOs();
    };
    // Local Work Order Card
    const WOCard = ({ item }: { item: WorkOrder }) => {
        const wo = item;
        const canUpload: boolean = wo.errData?.isErr ?? false;
        return (
            <Card key={wo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <WOCardContent wo={wo} isLocal={true} t={t} theme={theme} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="delete" onPress={() => handleDelete(wo)} icon="delete-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEdit(wo)} icon="pencil-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="copyAdd" onPress={() => handleCopyAdd(wo)} icon="plus-box-multiple-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="upload" onPress={() => handleUpload(wo)} disabled={canUpload || isOffLine} icon="cloud-upload" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleDetail(wo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={localWOs}
                    ItemElement={WOCard}
                    rowsPerPage={10}
                    searchFields={["id", "billDate", "billNumber", "creator.name", "department.name"]}
                    sortFunction={wosSortByid}
                    refreshing={false}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <Button icon="plus" color={theme.colors.primary} onPress={handleAdd}>{t("add")}</Button>
                <Button icon="refresh" color={theme.colors.primary} onPress={handleGetLocalWOs}>{t("refresh")}</Button>
            </Surface>
        </View>
    );
};

export default LocalWorkOrderList;