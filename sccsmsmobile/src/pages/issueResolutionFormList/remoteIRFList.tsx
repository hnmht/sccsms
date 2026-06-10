import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Button, Card, IconButton, Surface, MD3Theme } from "react-native-paper";
import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store/hooks";

import DocList from "../../components/DocList/DocList";
import EORefer from "./EORefer";
import IRFCardContent from "./IRFCardContent";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { reqIRFList, reqConfirmIRF, reqUnConfirmIRF, reqDeleteIRF } from "../../api/issueResolutionForm";
import { generateIRFConditions, generateEOConditions, irfSortByID, irfQueryFields, eoQueryFields } from "./constructor";
import { BusinessNavParamList } from "../../navigation/config/screenParams";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { Condition } from "../../dataType/types/queryPanel";
import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";

interface IRFDiagStatus {
    isOpen: boolean;
    content: 0 | 1 | 2 | 3 | 4;// 1 IRF Edit 2 IRF Filter conditions 3 Refer EO  4 EO Filter Conditions
}

interface RemoteIRFListProps {
    t: TFunction;
    theme: MD3Theme;
    isOffline: boolean;
    navigation: NativeStackNavigationProp<BusinessNavParamList, keyof BusinessNavParamList>;
}

function RemoteDisposeDocList({
    t,
    theme,
    isOffline,
    navigation,
}: RemoteIRFListProps) {
    const [remoteIRFs, setRemoteIRFs] = useState<IssueResolutionForm[]>([]);
    const [IRFConditions, setIRFConditions] = useState(generateIRFConditions());
    const [eoConditions, setEoConditions] = useState(generateEOConditions());
    const [diagStatus, setDiagStatus] = useState<IRFDiagStatus>({
        isOpen: false,
        content: 0
    });
    const [refreshing, setRefreshing] = useState(false);
    const user = useAppSelector(state => state.user);
    // Command button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        handleReqIRFs(IRFConditions);
    }, []);
    // Close dialog
    const handleDiagClose = () => {
        setDiagStatus({
            isOpen: false,
            content: 0
        });
    };

    // Request IRF list from server with conditions
    const handleReqIRFs = async (cons = IRFConditions) => {
        setRefreshing(true);
        // Convert conditions to query string
        let queryString = transConditionsToString(cons);
        // Request data from server
        let irfsRes = await reqIRFList({ queryString: queryString });
        let newIRFs: IssueResolutionForm[] = [];
        if (irfsRes.status) {
            newIRFs = irfsRes.data;
        }
        setRemoteIRFs(newIRFs);
        setRefreshing(false);
    };
    // Actions after press query button 
    const handlePressQuery = () => {
        setDiagStatus({
            isOpen: true,
            content: 2
        });
    };

    // Actions after press ok button in IRF filter conditions dialog
    const handleIRFQueryOk = (value: Condition[] = IRFConditions) => {
        setIRFConditions(value);
        setDiagStatus({
            isOpen: false,
            content: 0
        });
        // Request IRF list with new conditions
        handleReqIRFs(value);
    };

    // Actions after press add reference button 
    const handleAddRef = () => {
        setDiagStatus({
            isOpen: true,
            content: 4
        });
    };

    // Actions after press ok button in EO filter conditions dialog
    const handleEOQueryOk = (cons: Condition[] = eoConditions) => {
        setEoConditions(cons);
        setDiagStatus({
            isOpen: true,
            content: 3
        });
    };
    // Actions after press ok button in EO refer dialog
    const handleEOReferOk = (item: ReferExecutionOrder) => {
        setDiagStatus({
            isOpen: false,
            content: 0
        });
        // Navigate to IRF form with referenced EO data
        navigation.navigate("IssueResolutionForm", {
            isLocal: false,
            isNew: true,
            isModify: false,
            oriEOR: item,
            oriIRF: undefined,
            onGoBack: () => handleReqIRFs()
        });
    };

    // Actions after press view detail button in IRF card
    const handleViewAction = (item: IssueResolutionForm) => {
        navigation.navigate("IssueResolutionForm", {
            isLocal: false,
            isNew: false,
            isModify: false,
            oriEOR: undefined,
            oriIRF: item,
            onGoBack: () => handleReqIRFs()
        });
    };

    // Actions after press edit button in IRF card
    const handleEditAction = async (item: IssueResolutionForm) => {
        navigation.navigate("IssueResolutionForm", {
            isLocal: false,
            isNew: false,
            isModify: true,
            oriEOR: undefined,
            oriIRF: item,
            onGoBack: () => handleReqIRFs()
        });
    };
    // Actions after press confirm button in IRF card
    const handleConfirm = async (item: IssueResolutionForm) => {
        const res = await reqConfirmIRF(item);
        if (res.status) {
            Alert.alert(t("tip"), t("confirmSuccessful"));
        } else {
            return
        }
        // Refresh data after confirming
        handleReqIRFs();
    };

    // Actions after press unconfirm button in IRF card
    const handleUnConfirm = async (item: IssueResolutionForm) => {
        const res = await reqUnConfirmIRF(item);
        if (res.status) {
            Alert.alert(t("tip"), t("unconfirmSuccessful"));
        } else {
            return
        }
        // refresh data after unconfirming
        handleReqIRFs();
    };

    // Actions after press delete button in IRF card
    const handleDelete = async (item: IssueResolutionForm) => {
        let res = await reqDeleteIRF(item);
        if (res.status) {
            Alert.alert(t("tip"), t("deleteSuccessful"));
        } else {
            return;
        }
        // Refresh data after deleting
        handleReqIRFs();
    };

    // Content of the dialog, different content will be rendered according to the value of diagStatus.content
    const DiagContent = ({ status }: { status: IRFDiagStatus }) => {
        switch (status.content) {
            case 1:
                return null;
            case 2:
                return <QueryPanel
                    title="irfFilterCondition"
                    queryFields={irfQueryFields}
                    initalConditions={IRFConditions}
                    onOk={handleIRFQueryOk}
                    onCancel={handleDiagClose}
                />;
            case 3:
                return <EORefer
                    isOffline={isOffline}
                    title="generateRefEOR"
                    conditions={eoConditions}
                    cancelPressAction={handleDiagClose}
                    okPressAction={handleEOReferOk}
                    filterButtonDisp={true}
                    filterAction={handleAddRef}
                    theme={theme}
                    t={t}
                />;
            case 4:
                return <QueryPanel
                    title="eorFilterCondition"
                    queryFields={eoQueryFields}
                    initalConditions={eoConditions}
                    onOk={handleEOQueryOk}
                    onCancel={handleDiagClose}
                />;
            default:
                return null;
        }
    };

    const IRFCard = ({ item }: { item: IssueResolutionForm }) => {
        const irf = item;
        const delDisable = !(irf.status === 0 && irf.creator.id === user.id);
        const editDisable = !(irf.status === 0 && irf.creator.id === user.id);
        const startDisable = !(irf.status === 0);
        const stopDisable = !(irf.status === 1 && irf.confirmer.id === user.id);

        return (
            <Card key={irf.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <IRFCardContent irf={irf} isLocal={false} t={t} theme={theme} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="cancelConfirm" onPress={() => handleUnConfirm(irf)} icon="arrow-left-top" disabled={stopDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="confirm" onPress={() => handleConfirm(irf)} icon="play" disabled={startDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="delete" onPress={() => handleDelete(irf)} icon="delete-outline" disabled={delDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEditAction(irf)} icon="pencil-outline" disabled={editDisable} iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleViewAction(irf)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <DocList
                    rows={remoteIRFs}
                    ItemElement={IRFCard}
                    rowsPerPage={10}
                    searchFields={["id", "billDate", "billNumber", "creator.name", "department.name", "epa.name", "csa.name", "eoDescription", "description", "sourceBillNumber"]}
                    sortFunction={irfSortByID}
                    refreshing={refreshing}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
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

export default RemoteDisposeDocList;