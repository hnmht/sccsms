import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { IconButton, Card, Button, Surface, MD3Theme } from "react-native-paper";

import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import DocList from "../../components/DocList/DocList";
import EORefer from "./EORefer";
import IRFCardContent from "./IRFCardContent";

import { getAllDynamicDataOnline } from "../../store/pub";
import { updateDynamicEORefs } from "../../store/slice/dynamicData";
import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { reqAddIRF } from "../../api/issueResolutionForm";
import { irfSortByID } from "./constructor";
import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BusinessNavParamList } from "../../navigation/config/screenParams";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { IRFRepo } from "../../db/crud/issueResolutionForm";
import { ReferExecutionOrder } from "../../dataType/types/executionOrder";
import { getLocalEOR, updateEoRefStatus } from "../../db/crud/executionOrderRef";
import { cloneDeep } from "lodash";
import { convertIRFToFiles } from "../issueResolutionForm/constructor";
import { buildUploadFormData } from "../../utils/upload";
import { ScComponentModal } from "../../components/ScComponentModal/ScComponentModal";

interface LocalIRFListProps {
    t: TFunction;
    theme: MD3Theme;
    isOffline: boolean;
    navigation: NativeStackNavigationProp<BusinessNavParamList, keyof BusinessNavParamList>;
}

function LocalIRFList({
    t,
    theme,
    isOffline,
    navigation
}: LocalIRFListProps) {
    const [localIRFs, setLocalIRFs] = useState<IssueResolutionForm[]>([]);
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [diagStatus, setDiagStatus] = useState({
        isOpen: false,
    });
    const user = useAppSelector(state => state.user);
    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    const dispatch = useAppDispatch();
    // Get local Issue Resolution Form list
    const handleGetLocalIRFs = () => {
        let newIRFs = IRFRepo.getUserVouchers(user.id);
        setLocalIRFs(newIRFs);
    };

    useEffect(() => {
        handleGetLocalIRFs();
    }, []);

    // Close Refernce Execution Order Dialog
    const handleDialogClose = () => {
        setDiagStatus({
            isOpen: false
        });
    };
    // Actions after press ok button in reference Execution Order dialog
    const handleEOReferOk = (item: ReferExecutionOrder) => {
        setDiagStatus({
            isOpen: false
        });
        // Navigate to edit IRF page
        navigation.navigate("IssueResolutionForm", {
            isLocal: false,
            isNew: true,
            isModify: false,
            oriEOR: item,
            oriIRF: undefined,
            onGoBack: () => handleGetLocalIRFs()
        });
    };

    // Actions after press delete button 
    const handleDelete = (item: IssueResolutionForm) => {
        // Update the local EORef data status
        if (item.sourceBID !== 0 && isOffline) {
            updateEoRefStatus(item.sourceBID, 1);
            // Refresh redux
            const eorefs = getLocalEOR();
            dispatch(updateDynamicEORefs(eorefs));
        }
        // Delete local IRF
        IRFRepo.delVoucher(item);
        // Refresh IRF List
        handleGetLocalIRFs();
    };
    // Actions after press Edit button
    const handleEdit = (item: IssueResolutionForm) => {
        navigation.navigate("IssueResolutionForm", {
            isLocal: true,
            isNew: false,
            isModify: true,
            oriEOR: undefined,
            oriIRF: item,
            onGoBack: () => handleGetLocalIRFs()
        });
    };
    // Actions after press Detail button
    const handleDetail = (item: IssueResolutionForm) => {
        navigation.navigate("IssueResolutionForm", {
            isLocal: true,
            isNew: false,
            isModify: false,
            oriEOR: undefined,
            oriIRF: item,
            onGoBack: () => handleGetLocalIRFs()
        });
    };
    // Actions after press Upload button
    const handleUpload = async (item: IssueResolutionForm) => {
        let thisIRF = cloneDeep(item);
        thisIRF.id = 0;
        delete thisIRF.errData;
        if (thisIRF.ts === ""){
            delete thisIRF.ts;
        }        
        // Upload files first if there are files in the IRF, then upload the IRF
        setOverlayStatus({ visible: true, description: t("uploadingFiles") });
        try {
            const filesArr = convertIRFToFiles(item);
            if (filesArr.length > 0) {
                const getFilesHashRes = await reqGetFilesByHash(filesArr);
                if (!getFilesHashRes.status) {
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
                // upload files
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
                    // modify the file information in the IRF voucher according to the returned file list
                    const uploadFiles = uploadRes.data;
                    // combine the file that has obtained hash values with the file that has just been uploaded,
                    // to get the complete file list that the server returns
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }
                // Create a map to store the file information returned by the server, 
                // with the hash value as the key and the file information as the value,
                // which can be used to modify the file information in the IRF         
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.hash, item);
                });

                // Modify the file information in the IRF voucher according to the file information returned by the server, 
                // to ensure that the file information in the IRF voucher is consistent with the file information on the server
                thisIRF.fixFiles.map(vfile => {
                    if (vfile.file.id === 0) {
                        vfile.file = fileMap.get(vfile.file.hash);
                    }
                });
            }
            setOverlayStatus({ visible: true, description: t("uploadingVoucher") });

            thisIRF.id = 0;
            let addRes = await reqAddIRF(thisIRF);
            if (addRes.status) {
                IRFRepo.delVoucher(item);
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

        // If the source of the IRF is not UA,
        // it means that the data has not been synchronized to the server before,
        //  so after uploading, we need to synchronize the data to get the latest data including the uploaded data; if the source of the IRF is UA, it means that the data has been synchronized to the server before, and only one piece of data is uploaded this time, so there is no need to synchronize all the data, just add the uploaded data to the local data will be ok.
        if (thisIRF.sourceType !== "UA") {
            getAllDynamicDataOnline();
        }
        handleGetLocalIRFs();

    };
    // Issue Resolution Form Card
    const IRFCard = ({ item }: { item: IssueResolutionForm }) => {
        const irf = item;
        const canUpload: boolean = irf.errData?.isErr ?? false;
        return (
            <Card key={irf.id} style={{ marginTop: 2, marginBottom: 2 }}>
                <IRFCardContent irf={irf} isLocal={true} t={t} theme={theme} />
                <Card.Actions style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse" }}>
                    <IconButton key="delete" onPress={() => handleDelete(irf)} icon="delete-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="edit" onPress={() => handleEdit(irf)} icon="pencil-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="upload" onPress={() => handleUpload(irf)} disabled={canUpload || isOffline} icon="cloud-upload" iconColor={theme.colors.primary} size={20} mode="contained" />
                    <IconButton key="detail" onPress={() => handleDetail(irf)} icon="eye-outline" iconColor={theme.colors.primary} size={20} mode="contained" />
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
                    rows={localIRFs}
                    ItemElement={IRFCard}
                    rowsPerPage={10}
                    searchFields={["id", "billDate", "billNumber", "creator.name", "department.name", "epa.name", "csa.name", "eoDescription", "description", "sourceBillNumber"]}
                    sortFunction={irfSortByID}
                    refreshing={false}
                />
            </View>
            <Surface style={{ minHeight: 40, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                <Button icon="link-plus" textColor={theme.colors.primary} onPress={() => setDiagStatus({ isOpen: true })} disabled={!isOffline}>{t("addReference")}</Button>
                <Button icon="refresh" textColor={theme.colors.primary} onPress={handleGetLocalIRFs}>{t("refresh")}</Button>
            </Surface>
            <ScComponentModal
                visible={diagStatus.isOpen}
            >
                <EORefer
                    title={"generateRefEOR"}
                    isOffline={isOffline}
                    cancelPressAction={handleDialogClose}
                    okPressAction={handleEOReferOk}
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

export default LocalIRFList;
