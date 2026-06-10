import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { IconButton, Card, Button, Surface, MD3Theme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import DocList from "../../components/DocList/DocList";
import WORefer from "./WORefer";
import EOCardContent from "./EOCardContent";
import { getAllDynamicDataOnline } from "../../store/pub";
import { updateDynamicWORefs } from "../../store/slice/dynamicData";
import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { eosSortByID } from "./constructor";
import { transEOToBackend, transVoucherDataToFiles } from "../executionOrder/constructor";
import { reqAddEO } from "../../api/executionOrder";
import { updateWORefStatus, getLocalWOR } from "../../db/crud/workorderref";
import { BusinessNavParamList } from "../../navigation/config/screenParams";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { EORepo } from "../../db/crud/executionOrder";
import { WorkOrderRow } from "../../dataType/types/workOrder";
import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";
import { buildUploadFormData } from "../../utils/upload";

interface LocalEOListProps {
    t: TFunction;
    theme: MD3Theme;
    isOffline: boolean;
    navigation: NativeStackNavigationProp<BusinessNavParamList, keyof BusinessNavParamList>;
}

function LocalEOList({
    t,
    theme,
    isOffline,
    navigation,
}: LocalEOListProps) {
    const [localEOs, setLocalEOs] = useState<ExecutionOrder[]>([]);
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
    });
    const user = useAppSelector(state => state.user);
    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    const dispatch = useAppDispatch();

    // Get Local Execution Order list
    const handleGetLocalEOs = (shouldRefresh: boolean = true) => {
        if (!shouldRefresh) {
            return
        }
        let newEOs = EORepo.getUserVouchers(user.id);
        setLocalEOs(newEOs);
    };

    useEffect(() => {
        handleGetLocalEOs(true);
    }, []);

    // Close Reference Work Order Dialog
    const handleDialogClose = () => {
        setDiagStatus({
            isOpen: false
        });
    };
    // Actions after press ok in reference work order dialog
    const handleWoReferOk = (item: WorkOrderRow) => {
        setDiagStatus({
            isOpen: false
        });
        // Navigate to edit ExecutionOrder page
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: item, oriEO: undefined, onGoBack: handleGetLocalEOs });
    };
    // Actions after press add button
    const handleAdd = () => {
        navigation.navigate("ExecutionOrder", { isLocal: false, isNew: true, isModify: false, oriWOR: undefined, oriEO: undefined, onGoBack: handleGetLocalEOs });
    };
    // Delete local Execution Order
    const handleDelete = (item: ExecutionOrder) => {
        // Update the lcoal woref data status
        if (item.sourceBID !== 0 && isOffline) {
            updateWORefStatus(item.sourceBID, 1);
            // Refresh Redux
            const worefs = getLocalWOR();
            dispatch(updateDynamicWORefs(worefs));
        }
        // Delete local Execution Order
        EORepo.delVoucher(item);
        // Refresh Execution Order list
        handleGetLocalEOs(true);
    };
    // Actions after press Edit button 
    const handleEdit = (item: ExecutionOrder) => {
        navigation.navigate("ExecutionOrder", { isLocal: true, isNew: false, isModify: true, oriWOR: undefined, oriEO: item, onGoBack: handleGetLocalEOs });
    };
    // Actions after press detail button
    const handleDetail = (item: ExecutionOrder) => {
        navigation.navigate("ExecutionOrder", { isLocal: true, isNew: false, isModify: false, oriWOR: undefined, oriEO: item, onGoBack: handleGetLocalEOs });
    };
    // Actions after press upload button
    const handleUpload = async (item: ExecutionOrder) => {
        const thisEO = transEOToBackend(item);
        // Upload files first if there are files in the EO, then upload the EO
        setOverlayStatus({ visible: true, description: t("uploadingFiles") });
        try {
            // Get files array from EO
            const filesArr = transVoucherDataToFiles(thisEO);
            if (filesArr.length > 0) {
                const getFilesHashRes = await reqGetFilesByHash(filesArr);
                if (!getFilesHashRes.status) {
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
                // If there are files that have not obtained hash values, 
                // it means that these files have not been uploaded to the server,
                //  so upload these files first, 
                // and then get the file list that the server returns after uploading,
                //  and modify the file information in the EO body according to the returned file list.
                //  If all files have obtained hash values, 
                // it means that all files have been uploaded to the server, 
                // so there is no need to upload files, 
                // just modify the file information in the EO body according to the returned file list.
                const { formData, uploadedFileNumber: willUploadFileNumber, existingFiles } = buildUploadFormData(getFilesHashRes.data);
                let willUploadFiles = existingFiles;
                if (willUploadFileNumber > 0) {
                    // Upload files that have not obtained hash values to the server, 
                    // and get the file list returned by the server after uploading
                    const uploadRes = await reqUploadFiles(formData, false);
                    if (!uploadRes.status) {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                    // modify the file information in the EO body according to the returned file list
                    const uploadFiles = uploadRes.data;
                    // combine the file that has obtained hash values with the file that has just been uploaded,
                    // to get the complete file list that the server returns
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }
                // Create a map to store the file information returned by the server, 
                // with the hash value as the key and the file information as the value,
                // which can be used to modify the file information in the EO body
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.hash, item);
                });
                // modify the file information in the EO body according to the file list returned by the server,
                thisEO.body.map(row => {
                    row.files.map((rowFile) => {
                        if (rowFile.file.id === 0) {
                            rowFile.file = fileMap.get(rowFile.file.hash);
                        }
                    })
                });
            }
            setOverlayStatus({ visible: true, description: t("uploadingVoucher") });

            thisEO.id = 0
            delete thisEO.errData;
            
            let addRes = await reqAddEO(thisEO);
            if (addRes.status) {
                EORepo.delVoucher(item);
                Alert.alert(t("tip"), t("addSuccessful"));
            } else {
                setOverlayStatus({ visible: false, description: "" });
                return
            }
        }
        catch (err) {
            setOverlayStatus({ visible: false, description: "" });
            return
        }
        setOverlayStatus({ visible: false, description: "" });
        // if the source type of the EO is not UA,
        // update the local dynamic data to make the online data and local data consistent
        if (thisEO.sourceType !== "UA") {
            getAllDynamicDataOnline();

        }
        handleGetLocalEOs();
    };
    // Execution Order Card component
    const EOCard = ({ item }: { item: ExecutionOrder }) => {
        const eo = item;
        const canUpload: boolean = eo.errData?.isErr ?? false;
        return (
            <Card key={eo.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <EOCardContent eo={eo} isLocal={true} theme={theme} t={t} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="delete" onPress={() => handleDelete(eo)} icon="delete-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEdit(eo)} icon="pencil-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="upload" onPress={() => handleUpload(eo)} disabled={canUpload || isOffline} icon="cloud-upload" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleDetail(eo)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                </Card.Actions>
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />

            <View style={{ flex: 1 }}>
                <DocList
                    rows={localEOs}
                    ItemElement={EOCard}
                    rowsPerPage={10}
                    searchFields={["billDate", "billNumber", "creator.name", "department.name", "csa.name", "ept.name", "startTime", "description"]}
                    sortFunction={eosSortByID}
                    refreshing={false}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton icon="plus" iconColor={theme.colors.primary} onPress={handleAdd} />
                <Button icon="link-plus" textColor={theme.colors.primary} onPress={() => setDiagStatus({ isOpen: true })} disabled={!isOffline}>{t("addReference")}</Button>
                <Button icon="refresh" textColor={theme.colors.primary} onPress={() => handleGetLocalEOs(true)}>{t("refresh")}</Button>
            </Surface>
            <ScComponentModal
                visible={diagStatus.isOpen}
            >
                <WORefer
                    title={"generateRefWO"}
                    isOffline={isOffline}
                    cancelPressAction={handleDialogClose}
                    okPressAction={handleWoReferOk}
                    filterButtonDisp={false}
                    conditions={[]}
                    filterAction={() => { }}
                    theme={theme}
                    t={t}
                />
            </ScComponentModal>
        </View>
    );
};

export default LocalEOList;
