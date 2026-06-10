import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, Button, ActivityIndicator, Surface, useTheme } from "react-native-paper";

import { ScVoucherHeader, ScVoucherFooter } from "../../components/ScVoucher";
import ScInput from "../../components/ScInput";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";

import { updateEoRefStatus, getLocalEOR } from "../../db/crud/executionOrderRef";
import { getInitialValue, checkIRFErrors, convertIRFToFiles, generateMarkText } from "./constructor";
import { updateDynamicEORefs } from "../../store/slice/dynamicData";
import { getAllDynamicDataOnline } from "../../store/pub";

import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { reqAddIRF, reqEditIRF } from "../../api/issueResolutionForm";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { cloneDeep } from "lodash";
import { IRFRepo } from "../../db/crud/issueResolutionForm";
import { useTranslation } from "react-i18next";
import { buildUploadFormData } from "../../utils/upload";
import { SafeAreaView } from "react-native-safe-area-context";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

function EditIRF() {
    const navigation = useBusinessNavigation();
    const route = useBusinessRoute<"IssueResolutionForm">();
    const theme = useTheme();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { isLocal, isNew, isModify, oriEOR, oriIRF, onGoBack } = route.params;

    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [voucherData, setVoucherData] = useState<IssueResolutionForm | undefined>((undefined));

    const { person } = useAppSelector(state => state.user);
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const dataErrs = useMemo(() => checkIRFErrors(voucherData), [voucherData]);

    // Command button position
    const { buttonPosition, orderPosition, orderVisible } = useAppSelector(state => state.swapPosition);

    const isEdit = !(!isModify && !isNew);
    const canTempSave = isLocal ? true : isModify ? false : true;
    // const isErr = useMemo(() => checkObjErrors(dataErrs), [dataErrs]);
    const markTexts = generateMarkText(voucherData);

    useEffect(() => {
        async function initVoucher() {
            const newDD = await getInitialValue(isNew, isModify, oriEOR, oriIRF);
            setVoucherData(newDD);
        }
        initVoucher();
    }, [oriEOR, isModify, oriIRF, isNew]);
    // Actions upon receiving value from ScInput component
    const handleGetValue = async<T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (!isEdit || voucherData === undefined) {
            return
        }
        // Update Voucher data
        setVoucherData((prevState: IssueResolutionForm | undefined) => {
            if (prevState === undefined) {
                return undefined;
            }
            let newValue = cloneDeep(prevState);
            (newValue as unknown as Record<string, unknown>)[itemKey] = value;
            return newValue;
        });
    };
    // Actions after press cancel button
    const handleCancel = () => {
        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };
    // Actions after press temp save button
    const handleTempSave = () => {
        if (voucherData === undefined) {
            return
        }
        let newVoucherData = cloneDeep(voucherData);
        // Record errors befor saving,  so that can recommend if can upload or not
        if (isModify) { // in edit mode
            if (isLocal) {
                // if it is a local IRF, directly update the local database
                IRFRepo.editVoucher(newVoucherData);
            } else { // if it is a remote IRF, do not allow to temp save
                Alert.alert(t("err"), t("notAllowedStagRemotoVoucher"));
            }
        } else { // in new mode, directly save to local database
            if (newVoucherData.sourceBID !== 0 && isOffLine === 1) {
                updateEoRefStatus(newVoucherData.sourceBID, 2);
                // Update the Execution Order reference status
                const eorefs = getLocalEOR();
                dispatch(updateDynamicEORefs(eorefs));
            }
            IRFRepo.saveVoucher(newVoucherData, person.id);
        }

        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };
    // Actions after press upload button
    const handleUpload = async () => {
        if (voucherData === undefined) {
            return
        }
        let thisIRF = cloneDeep(voucherData);

        delete thisIRF.errData;
        if (thisIRF.ts === "") {
            delete thisIRF.ts;
        };

        // Upload files 
        setOverlayStatus({ visible: true, description: t("uploadingFiles") });
        try {
            const filesArr = convertIRFToFiles(thisIRF);
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
                    const uploadRes = await reqUploadFiles(formData, false);
                    if (!uploadRes.status) {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                    // Modify the file information in the IRF form body according to the upload result
                    const uploadFiles = uploadRes.data;
                    // Combine the files that need to be uploaded with the files that have been uploaded before
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }

                // create a fileMap to quickly find the uploaded file information according to the file hash value, and modify the file information in the IRF form body according to the file hash value
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.hash, item);
                });

                // modify the file information in the IRF form body according to the file hash value
                thisIRF.fixFiles.map(vfile => {
                    if (vfile.file.id === 0) {
                        vfile.file = fileMap.get(vfile.file.hash);
                    }
                });
            }
            setOverlayStatus({ visible: true, description: t("uploadingVoucher") });
            if (isModify) {
                if (isLocal) {// upload local IRF
                    thisIRF.id = 0;
                    delete thisIRF.errData;
                    let addRes = await reqAddIRF(thisIRF);
                    if (addRes.status) {
                        IRFRepo.delVoucher(voucherData);
                        Alert.alert(t("tip"), t("addSuccessful"));
                    } else {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                } else { // upload remote IRF, which means directly edit the IRF
                    const editRes = await reqEditIRF(thisIRF);
                    if (editRes.status) {
                        Alert.alert(t("tip"), t("modifySuccessful"));
                    } else {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                }
            } else { // Add new IRF, which means directly add the IRF
                let addRes = await reqAddIRF(thisIRF);
                if (addRes.status) {
                    Alert.alert(t("tip"), t("addSuccessful"));
                } else {
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
            }
        }
        catch (err) {
            setOverlayStatus({ visible: false, description: "" });
            return
        }
        setOverlayStatus({ visible: false, description: "" });

        // if the IRF is added or modified from local, after uploading successfully, 
        // need to delete the local data, 
        // and update the Execution Order reference status if it has sourceBID, 
        // and get all dynamic data if the source document type is not UA and the app is online, 
        // so that the data can be updated in the list page
        if (thisIRF.sourceType !== "UA" && isOffLine === 0) {
            getAllDynamicDataOnline();
        }

        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />
            <View key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>{t("MenuIRF")}</Text>
            </View>
            {voucherData !== undefined
                ? <View style={{ flex: 1 }}>
                    <ScrollView>
                        <ScVoucherHeader
                            isHeaderErr={false}
                            title="issueInformation"
                            buttonPosition={buttonPosition}
                            theme={theme}
                            t={t}
                        >
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="billNumber"
                                itemKey="billNumber"
                                errInfo={{ isErr: false, msg: "" }}
                                initValue={voucherData.billNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billNumber"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="billDate"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="billDate"
                                initValue={voucherData.billDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="billDate"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={570}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="csa"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="csa"
                                initValue={voucherData.csa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="csa"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={560}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="epa"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="epa"
                                initValue={voucherData.epa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="epa"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={590}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="riskLevel"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="riskLevel"
                                initValue={voucherData.riskLevel}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="riskLevel"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="executionValueDisp"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="executionValueDisp"
                                placeholder={""}
                                initValue={voucherData.executionValueDisp}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executionValueDisp"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="eoDescription"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="eoDescription"
                                placeholder={"descriptionPlaceholder"}
                                initValue={voucherData.eoDescription}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="eoDescription"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="issueFiles"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="issueFiles"
                                initValue={voucherData.issueFiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="issueFiles"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="executor"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="executor"
                                initValue={voucherData.executor}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executor"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceType"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="sourceType"
                                initValue={voucherData.sourceType}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceType"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceBillNumber"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="sourceBillNumber"
                                initValue={voucherData.sourceBillNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceBillNumber"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={302}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="sourceRowNumber"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="sourceRowNumber"
                                initValue={voucherData.sourceRowNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceRowNumber"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="issueOwner"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="issueOwner"
                                initValue={voucherData.issueOwner}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="issueOwner"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                        </ScVoucherHeader>
                        <ScVoucherHeader
                            isHeaderErr={false}
                            title="issueResolutionInformation"
                            buttonPosition={buttonPosition}
                            theme={theme}
                            t={t}
                        >
                            <ScInput
                                dataType={520}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="department"
                                itemKey="department"
                                initValue={voucherData.department}
                                errInfo={dataErrs.department}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="handler"
                                errInfo={dataErrs.handler}
                                itemKey="handler"
                                initValue={voucherData.handler}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="handler"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="startTime"
                                itemKey="startTime"
                                initValue={voucherData.startTime}
                                errInfo={dataErrs.startTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="startTime"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="endTime"
                                itemKey="endTime"
                                initValue={voucherData.endTime}
                                errInfo={dataErrs.endTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endTime"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="description"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="description"
                                placeholder={"description"}
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                                textLines={1}
                                width="100%"
                            />
                            <ScInput
                                dataType={902}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="fixFiles"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="fixFiles"
                                initValue={voucherData.fixFiles}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="fixFiles"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                                markTexts={markTexts}
                            />
                            <ScInput
                                dataType={405}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="status"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="status"
                                initValue={voucherData.status}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="status"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />

                        </ScVoucherHeader>
                        <ScVoucherFooter
                            isFooterErr={false}
                            title="voucherFooter"
                            buttonPosition={buttonPosition}
                            theme={theme}
                            t={t}
                        >
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="creator"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="creator"
                                initValue={voucherData.creator}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="creator"
                                positionID={2}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="createDate"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="createDate"
                                initValue={voucherData.createDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createDate"
                                positionID={2}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifier"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="modifier"
                                initValue={voucherData.modifier}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifier"
                                positionID={2}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="modifyDate"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="modifyDate"
                                initValue={voucherData.modifyDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifyDate"
                                positionID={2}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="confirmer"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="confirmer"
                                initValue={voucherData.confirmer}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmer"
                                positionID={2}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={309}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="confirmDate"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="confirmDate"
                                initValue={voucherData.confirmDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmDate"
                                positionID={2}
                                rowIndex={-1}
                                width="100%"
                            />
                        </ScVoucherFooter>
                    </ScrollView>
                    {isEdit
                        ? <Surface style={{ minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center", justifyContent: "flex-end" }}>
                            {canTempSave
                                ? <Button onPress={handleTempSave} icon="cellphone-arrow-down" >{t("draft")}</Button>
                                : null
                            }
                            {isOffLine === 0
                                ? <Button icon="cloud-upload" onPress={handleUpload} disabled={dataErrs.isErr}>{t("upload")}</Button>
                                : null
                            }
                        </Surface>
                        : null
                    }
                    <ScHandSwitch
                        refreshDisplay={false}
                        docRefresh={() => { }}
                        cancelAction={handleCancel}
                        theme={theme}
                        t={t}
                    />
                </View>
                : <ActivityIndicator animating={true} />
            }
        </SafeAreaView>
    );
};

export default EditIRF;