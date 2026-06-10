import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, Button, ActivityIndicator, useTheme, Surface } from "react-native-paper";
import { dayjs } from "../../i18n/dayjs";
import { cloneDeep } from "lodash";
import { ScVoucherHeader, ScVoucherBody, ScVoucherFooter } from "../../components/ScVoucher";
import ScInput from "../../components/ScInput";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import { getAllDynamicDataOnline } from "../../store/pub";
import { updateDynamicWORefs } from "../../store/slice/dynamicData";
import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { reqAddEO, reqEditEO } from "../../api/executionOrder";
import { multiSortByArr } from "../../components/tools/sort";
import { getInitialValue, checkEOErrors, checkForProblem, eptBodyToEOBody, transVoucherDataToFiles, transEOToBackend, generateMarkText } from "./constructor";
import { updateWORefStatus, getLocalWOR } from "../../db/crud/workorderref";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ExecutionOrder, ExecutionOrderRow } from "../../dataType/types/executionOrder";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { useTranslation } from "react-i18next";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { EORepo } from "../../db/crud/executionOrder";
import EOBodyMenu from "./EOBodyMenu";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { getDefaultExecutionOrderRow } from "../../dataType/dataZero/executionOrder";
import { isEPTLike } from "../../dataType/dataZero/ept";
import { isCSALike } from "../../dataType/dataZero/csa";
import { isEPALike } from "../../dataType/types/epa";
import { SafeAreaView } from "react-native-safe-area-context";
import { buildUploadFormData } from "../../utils/upload";
import { startLocationWatch, stopLocationWatch } from "../../components/tools/location";


function EditExecutionOrder() {
    const navigation = useBusinessNavigation();
    const route = useBusinessRoute<"ExecutionOrder">();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { isLocal, isNew, isModify, oriWOR, oriEO, onGoBack } = route.params ?? {};
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [voucherData, setVoucherData] = useState<ExecutionOrder | undefined>((undefined));
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const { t } = useTranslation();
    const { person } = useAppSelector(state => state.user);
    //Command button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    const [deletedRows, setDeletedRows] = useState<ExecutionOrderRow[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const dataErrs = useMemo(() => checkEOErrors(voucherData), [voucherData]);

    const row = voucherData ? voucherData.body[currentRowIndex] : undefined;
    const rowErrs = dataErrs ? dataErrs.body[currentRowIndex] : undefined;
    const isEdit = !(!isModify && !isNew);
    const canTempSave = isLocal ? true : isModify ? false : true;
    const delButtonEnabled = row && (!isEdit || (row.allowDelRow === 0));
    const rowMarkTexts = generateMarkText(voucherData, row);

    useEffect(() => {
        function initVoucher() {
            const newED = getInitialValue(isNew, isModify, oriWOR, oriEO);
            setVoucherData(newED);
        }
        initVoucher();
    }, [oriWOR, isModify, oriEO, isNew]);

    // Start location watch when component is mounted, and stop location watch when component is unmounted
    useEffect(() => {
        startLocationWatch(dispatch);
        return () => {
            stopLocationWatch();
        };
    }, []);   

    // Actions after press cancel button
    const handleCancel = () => {
        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };
    // Reset Current row index to 0
    const handleResetCurrentRowIndex = () => {
        setCurrentRowIndex(0);
    };
    // Actions upon receiving values from ScInput Components
    const handleGetValue = async <T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (voucherData === undefined || !isEdit) {
            return
        }
        // Update Execution Order data value
        setVoucherData((prevState: ExecutionOrder | undefined) => {
            if (prevState === undefined) {
                return undefined;
            }
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0:// Update header data
                    // If modifying the EPT field
                    if (itemKey === "ept") {
                        if (isEPTLike(value) && value.id !== prevState.ept.id) {
                            // Reset current row index to 0
                            handleResetCurrentRowIndex();
                            const issueOwner = newData.csa.id === 0 ? newData.executor : newData.csa.respPerson;
                            // Convert EPT body to EO body
                            newData.body = eptBodyToEOBody(value.body, newData.startTime, newData.endTime, issueOwner);
                            newData.allowAddRow = value.allowAddRow;
                            newData.allowDelRow = value.allowDelRow;
                        } else {
                            console.warn("Unexpected ept value:", value);
                        }
                    }
                    // If modifying the CSA field
                    if (itemKey === "csa") {
                        if (isCSALike(value) && value.id !== prevState.csa.id) {
                            if (newData.body.length > 0) {
                                newData.body.map(row => {
                                    row.issueOwner = value.respPerson;
                                    return row;
                                })
                            }
                        } else {
                            console.warn("Unexpected csa value:", value);
                        }
                    }
                    //If modifying the start time field
                    if (itemKey === "startTime") {
                        if (typeof value === "string" && value !== prevState.startTime) {
                            //if the end time is less than or equal to the start time, automatically set the end time to 1 hour after the start time
                            if (newData.endTime <= value) {
                                newData.endTime = dayjs(value).add(1, "hours").toISOString();
                            }
                            // if Body row exists, automatically set the handleStartTime and handleEndTime
                            if (newData.body.length > 0) {
                                newData.body.map(row => {
                                    row.handleStartTime = dayjs(value).add(24, "hour").toISOString();
                                    row.handleEndTime = dayjs(newData.endTime).add(1, "day").toISOString();
                                    return row;
                                })
                            } else {
                                console.warn("Unexpected startTime value:", value);
                            }
                        }
                    }
                    // if modifying the end time field
                    if (itemKey === "endTime") {
                        if (typeof value === "string" && value !== prevState.endTime) {
                            // if the end time is less than or equal to the start time, automatically set the end time to 1 hour after the start time
                            if (newData.startTime >= value) {
                                newData.startTime = dayjs(value).subtract(1, "hours").toISOString();
                            }
                            // if body row exists, automatically set the handleStartTime and handleEndTime
                            if (newData.body.length > 0) {
                                newData.body.map(row => {
                                    row.handleStartTime = dayjs(newData.startTime).add(24, "hour").toISOString();
                                    row.handleEndTime = dayjs(value).add(1, "day").toISOString();
                                    return row;
                                })
                            }
                        }

                    }
                    if (itemKey in newData) {
                        // Write to the object by treating it as a mapping from string keys to unknown values,
                        // while preserving runtime checks
                        (newData as unknown as Record<string, unknown>)[itemKey] = value;
                    } else {
                        console.warn("Attempted to write unknown header key:", itemKey);
                    }
                    break;
                case 1://update body data         
                    // if updating the execution value field, and the row has auto check error enabled, 
                    // then automatically check if there is a problem and update the isIssue, isRectify and isHandle field accordingly
                    if (itemKey === "executionValue") {
                        if (newData.body[rowIndex].isCheckError === 1) {
                            let isProblem = checkForProblem(newData.body[rowIndex].epa.resultType.id, newData.body[rowIndex].errorValue, value);
                            newData.body[rowIndex].isIssue = isProblem;
                            if (isProblem === 0) {
                                newData.body[rowIndex].isRectify = 0;
                                newData.body[rowIndex].isHandle = 0;
                            } else {
                                if (newData.body[rowIndex].isRectify === 1) {
                                    newData.body[rowIndex].isHandle = 0;
                                } else {
                                    newData.body[rowIndex].isHandle = 1;
                                }
                            }
                        }
                    }
                    // If updating the isIssue field, then automatically update the isRectify and isHandle field accordingly
                    if (itemKey === "isIssue") {
                        if (value === 0) {
                            newData.body[rowIndex].isRectify = 0;
                            newData.body[rowIndex].isHandle = 0;
                        } else {
                            if (newData.body[rowIndex].isRectify === 0) {
                                newData.body[rowIndex].isHandle = 1;
                            } else {
                                newData.body[rowIndex].isHandle = 0;
                            }
                        }
                    }
                    // If updating the isRectify field, then automatically update the isHandle field accordingly
                    if (itemKey === "isRectify") {
                        if (value === 1) {
                            newData.body[rowIndex].isHandle = 0;
                        } else {
                            newData.body[rowIndex].isHandle = 1;
                        }
                    }
                    // if updating the epa field, then automatically update the execution value,
                    // execution value display, files, epa description, isCheckError, error value,
                    //  error value display, isRequireFile, isOnSitePhoto and risk level field accordingly
                    if (itemKey === "epa") {
                        if (isEPALike(value) && value.id !== prevState.body[rowIndex].epa.id) {
                            newData.body[rowIndex].executionValue = value.defaultValue;
                            newData.body[rowIndex].executionValueDisp = value.defaultValueDisp;
                            newData.body[rowIndex].files = [];
                            newData.body[rowIndex].epaDescription = value.description;
                            newData.body[rowIndex].isCheckError = value.isCheckError;
                            newData.body[rowIndex].errorValue = value.errorValue;
                            newData.body[rowIndex].errorValueDisp = value.errorValueDisp;
                            newData.body[rowIndex].isRequireFile = value.isRequireFile;
                            newData.body[rowIndex].isOnSitePhoto = value.isOnSitePhoto;
                            newData.body[rowIndex].isFromEpt = 0;
                            newData.body[rowIndex].riskLevel = value.riskLevel;
                        } else {
                            console.warn("Unexpected epa value:", value);
                        }
                    }
                    // if updating the handleStartTime field, 
                    // and the new handle start time is greater than or equal to the current handle end time,
                    //  then automatically set the handle end time to 1 hour after the new handle start time
                    if (itemKey === "handleStartTime") {
                        if (typeof value === "string" && newData.body[rowIndex].handleEndTime <= value) {
                            newData.body[rowIndex].handleEndTime = dayjs(value).add(1, "hours").toISOString();
                        }
                    }
                    // If updating the handleEndTime field, then automatically set the handle start time accordingly
                    if (itemKey === "handleEndTime") {
                        if (typeof value === "string" && newData.body[rowIndex].handleStartTime >= value) {
                            newData.body[rowIndex].handleStartTime = dayjs(value).subtract(1, "hours").toISOString();
                        }
                    }
                    const row = newData.body[rowIndex];
                    if (itemKey in row) {
                        // Write to the object by treating it as a mapping from string keys to unknown values,
                        (row as unknown as Record<string, unknown>)[itemKey] = value;
                    } else {
                        console.warn("Attempted to write unknown body key:", itemKey);
                    }
                    break;
                case 2: // update footer data
                    if (itemKey in newData) {
                        // Write to the object by treating it as a mapping from string keys to unknown values,
                        (newData as unknown as Record<string, unknown>)[itemKey] = value;
                    } else {
                        console.warn("Attempted to write unknown header key:", itemKey);
                    }
                    break;
                default:
                    break;
            }
            return newData;
        });

    };
    // Actions after press add row button
    const handleAddRow = () => {
        if (voucherData === undefined) return
        // Copy the original data to avoid direct mutation
        const newVoucherData = cloneDeep(voucherData);
        const newRow = getDefaultExecutionOrderRow(person, dayjs().toISOString())

        // Automatically set the row number of the new row,
        // if the body is empty, set it to 10, 
        // if there are existing rows, set it to 10 more than the last row number
        if (newVoucherData.body.length === 1) {
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(multiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // automatically set the handle person, handle start time and handle end time of the new row,
        const issueOwner = newVoucherData.csa.id === 0 ? newVoucherData.executor : newVoucherData.csa.respPerson;
        newRow.issueOwner = issueOwner;
        newRow.handleStartTime = newVoucherData.endTime;
        newRow.handleEndTime = newVoucherData.endTime;
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newVoucherData.body.length - 1);
    };
    // Actions after press delete row button
    const handleDeleteRow = () => {
        if (voucherData === undefined) {
            return
        }
        if (voucherData.body.length === 1) {
            Alert.alert(t("tip"), t("cannotDeleteLastRow"));
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        const newDeletedRows = cloneDeep(deletedRows);
        let row = newVoucherData.body[currentRowIndex];
        let newRowIndex = currentRowIndex;
        if (isModify) {
            // Determine whether the row to be deleted is a newly added row 
            // or an original row based on the id field, and handle them differently
            if (row.id === 0) {
                newVoucherData.body.splice(currentRowIndex, 1); // directly delete newly added row
            } else {
                //only mark the original row as deleted, and set dr to 1 to indicate that the row is deleted
                newVoucherData.body[currentRowIndex].dr = 1;
                //clear files to avoid unnecessary upload
                newVoucherData.body[currentRowIndex].files = [];
                //Temporarily store the deleted original row in newDeletedRows, and actually delete it when uploading the EO
                newDeletedRows.push(newVoucherData.body[currentRowIndex]);
                // delete the row from the current body to update the UI, but it is not actually deleted from the database at this time
                newVoucherData.body.splice(currentRowIndex, 1);
            }
        } else {
            // Delete the row directly if it is not in edit mode,
            //  and there is no need to consider whether it is a new row or an original row
            newVoucherData.body.splice(currentRowIndex, 1);
        }
        if (newRowIndex > (newVoucherData.body.length - 1)) {
            newRowIndex = newVoucherData.body.length - 1;
        }
        setDeletedRows(newDeletedRows);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newRowIndex);
    };
    // Actions after press Temp Save button
    const handleTempSave = () => {
        if (voucherData === undefined) {
            return
        }
        let newVoucherData = cloneDeep(voucherData);
        // Record errors before saving, so that can recommend if can upload or not
        newVoucherData.errData = dataErrs;
        // Temporary save the data to the local database.
        if (isModify) { // in edit mode
            if (isLocal) {
                // If it is a local EO, directly update the local database
                EORepo.editVoucher(newVoucherData);
            } else { // If it is a remote EO, it is not allowed to temp save
                Alert.alert(t("err"), t("notAllowedStagRemotoVoucher"));
            }
        } else { // in new mode, directly save the new EO to the local database
            // if the EO is generated by referring to a source document, and the app is currently in offline mode,
            //  then need to update the local work order reference data to set the reference document to executed status
            if (newVoucherData.sourceBID !== 0 && isOffLine === 1) {
                updateWORefStatus(newVoucherData.sourceBID, 2);
                // update the work order reference data in the redux store to update the UI
                const worefs = getLocalWOR();
                dispatch(updateDynamicWORefs(worefs));
            }
            EORepo.saveVoucher(newVoucherData, person.id);
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

        let newEO = cloneDeep(voucherData);
        if (isModify && deletedRows.length > 0) {
            newEO.body.push(...deletedRows);
        }
        const thisEO = transEOToBackend(newEO);

        // Upload files and EO data one by one, and set the overlay status to show the uploading process
        setOverlayStatus({ visible: true, description: t("uploadingFiles") });
        try {
            // First check if there are files to be uploaded, 
            // if there are files, then check with the server to get the hash value of the files,
            //  and determine whether the files need to be uploaded based on the hash value
            const filesArr = transVoucherDataToFiles(voucherData);
            if (filesArr.length > 0) {
                const getFilesHashRes = await reqGetFilesByHash(filesArr);
                if (!getFilesHashRes.status) {
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
                // upload files that have no hash value returned from the server, 
                // and get the file info including id and hash value after successful upload,
                //  then update the file list in the EO body to replace the file with id 0 with the file info returned from the server
                const { formData, uploadedFileNumber: willUploadFileNumber, existingFiles } = buildUploadFormData(getFilesHashRes.data);
                let willUploadFiles = existingFiles;

                if (willUploadFileNumber > 0) {
                    // Upload files to server
                    const uploadRes = await reqUploadFiles(formData, false);
                    if (!uploadRes.status) {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                    // Modify the file list in the EO body to replace the file with id 0 with the file info returned from the server
                    const uploadFiles = uploadRes.data;
                    // Combine the files that do not need to be uploaded with the files 
                    // returned from the server after successful upload, 
                    // and create a fileMap based on the hash value of the files for subsequent replacement
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }
                // Create a fileMap based on the hash value of the files for subsequent replacement
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.hash, item);
                });
                // Modify the file list in the EO body to replace the file with id 0 with the file info returned from the server
                thisEO.body.map(row => {
                    row.files.map((rowFile) => {
                        if (rowFile.file.id === 0) {
                            rowFile.file = fileMap.get(rowFile.file.hash);
                        }
                    })
                });
            }
            setOverlayStatus({ visible: true, description: t("uploadingVoucher") });
            if (isModify) {
                // Upload local EO, which is actually adding a new EO and deleting the original EO,
                //  because the original EO is only stored locally and has not been uploaded to the server, 
                // so it cannot be modified but can only be deleted
                if (isLocal) {
                    thisEO.id = 0
                    let addRes = await reqAddEO(thisEO);
                    if (addRes.status) {
                        EORepo.delVoucher(voucherData);
                        Alert.alert(t("tip"), t("addSuccessful"));
                    } else {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                } else { // Upload remote EO, which is directly modifying the EO on the server
                    const editRes = await reqEditEO(thisEO);
                    if (editRes.status) {
                        Alert.alert(t("tip"), t("modifySuccessful"));
                    } else {
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                }
            } else { // add new EO, directly add the EO to the server
                let addRes = await reqAddEO(thisEO);
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

        // If the EO is generated by referring to a source document, and the app is currently in offline mode,
        // then need to update the local work order reference data to set the reference document to executed status,
        // and update the work order reference data in the redux store to update the UI
        if (thisEO.sourceType !== "UA" && isOffLine === 0) {
            getAllDynamicDataOnline();
        }

        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <Surface key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>{t("MenuEO")}</Text>
            </Surface>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />
            {voucherData !== undefined
                ? <View style={{ flex: 1 }}>
                    <ScrollView>
                        <ScVoucherHeader
                            isHeaderErr={dataErrs.isHeaderErr ?? false}
                            title="voucherHeader"
                            buttonPosition={buttonPosition}
                            theme={theme}
                            t={t}
                        >
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="billNumber"
                                errInfo={{ isErr: false, msg: "" }}
                                pickDone={() => { }}
                                itemKey="billNumber"
                                initValue={isLocal ? `L${voucherData.id}` : voucherData.billNumber}
                                isBackendTest={false}
                                key="billNumber"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.Date}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="billDate"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="billDate"
                                initValue={voucherData.billDate}
                                pickDone={handleGetValue}
                                placeholder=""
                                isBackendTest={false}
                                key="billDate"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.SimpDept}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="department"
                                itemKey="department"
                                initValue={voucherData.department}
                                errInfo={dataErrs.department}
                                pickDone={handleGetValue}
                                placeholder="deptPlaceholder"
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.Person}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="executor"
                                itemKey="executor"
                                initValue={voucherData.executor}
                                errInfo={dataErrs.executor}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executor"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.ConstructionSite}
                                allowNull={false}
                                isEdit={isEdit && voucherData.sourceBID === 0}
                                itemShowName="csa"
                                itemKey="csa"
                                initValue={voucherData.csa}
                                errInfo={dataErrs.csa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="csa"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.EPT}
                                allowNull={false}
                                isEdit={isNew && isEdit && voucherData.sourceBID === 0}
                                itemShowName="ept"
                                itemKey="ept"
                                initValue={voucherData.ept}
                                errInfo={dataErrs.ept}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="ept"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.DateTime}
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
                                dataType={ScDataTypeList.DateTime}
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
                                dataType={ScDataTypeList.VoucherStatus}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.Number}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="description"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="description"
                                placeholder="descriptionPlaceholder"
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.CheckYesOrNo}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="allowAddRow"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="allowAddRow"
                                initValue={voucherData.allowAddRow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="allowAddRow"
                                positionID={0}
                                rowIndex={-1}
                            />
                        </ScVoucherHeader>
                        <ScVoucherBody
                            isBodyErr={dataErrs.isBodyErr ?? false}
                            title="voucherBody"
                            buttonPosition={buttonPosition}
                            isEdit={isEdit}
                            addRowAction={handleAddRow}
                            totalRows={voucherData.body.length}
                            theme={theme}
                            t={t}
                            bodyMenu={<EOBodyMenu
                                eoErrors={dataErrs}
                                eoRows={voucherData.body}
                                setCurrentRowIndex={setCurrentRowIndex}
                                theme={theme}
                                t={t}
                            />}
                            currentRowIndex={currentRowIndex}
                            setCurrentRowIndex={setCurrentRowIndex}
                            addRowDisabled={!(isEdit && voucherData.ept.id !== 0 && voucherData.allowAddRow === 1)}
                        >
                            {row !== undefined && rowErrs !== undefined
                                ? <>
                                    <View style={{ width: "100%", minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Button
                                            onPress={handleDeleteRow}
                                            icon="playlist-remove"
                                            textColor={theme.colors.error}
                                            disabled={delButtonEnabled}
                                            style={{ margin: 4 }}
                                        >
                                            {t("deleteRow")}
                                        </Button>
                                    </View>
                                    <ScInput
                                        dataType={ScDataTypeList.Number}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="rowNumber"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="rowNumber"
                                        initValue={row.rowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="rowNumber"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.VoucherStatus}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="status"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="status"
                                        initValue={row.status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.ExecutionProject}
                                        allowNull={false}
                                        isEdit={isEdit && row.isFromEpt === 0}
                                        itemShowName="epa"
                                        itemKey="epa"
                                        initValue={row.epa}
                                        errInfo={rowErrs.epa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="epa"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.RiskLevel}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="riskLevel"
                                        itemKey="riskLevel"
                                        initValue={row.riskLevel}
                                        errInfo={rowErrs.riskLevel}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="riskLevel"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={row.epa.resultType.id as any}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="executionValue"
                                        itemKey="executionValue"
                                        initValue={row.executionValue}
                                        errInfo={rowErrs.executionValue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executionValue"
                                        positionID={1}
                                        udc={row.epa.udc}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.FileUpload}
                                        allowNull={row.isRequireFile === 0}
                                        isEdit={isEdit}
                                        itemShowName="files"
                                        itemKey="files"
                                        initValue={row.files}
                                        errInfo={rowErrs.files}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="files"
                                        positionID={1}
                                        isOnSitePhoto={row.isOnSitePhoto === 1}
                                        rowIndex={currentRowIndex}
                                        markTexts={rowMarkTexts}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.CheckYesOrNo}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isRequireFile"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="isRequireFile"
                                        initValue={row.isRequireFile}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isRequireFile"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.CheckYesOrNo}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isOnSitePhoto"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="isOnSitePhoto"
                                        initValue={row.isOnSitePhoto}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isOnSitePhoto"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.Text}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="epaDescription"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="epaDescription"
                                        initValue={row.epaDescription}
                                        pickDone={handleGetValue}
                                        placeholder=""
                                        isBackendTest={false}
                                        key="epaDescription"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.Text}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="description"
                                        itemKey="description"
                                        errInfo={{ isErr: false, msg: "" }}
                                        initValue={row.description}
                                        pickDone={handleGetValue}
                                        placeholder="descriptionPlaceholder"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.CheckYesOrNo}
                                        allowNull={true}
                                        isEdit={isEdit && row.isCheckError === 0}
                                        itemShowName="isIssue"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="isIssue"
                                        initValue={row.isIssue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isIssue"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.CheckYesOrNo}
                                        allowNull={true}
                                        isEdit={isEdit && row.isIssue === 1}
                                        itemShowName="isRectify"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="isRectify"
                                        initValue={row.isRectify}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isRectify"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.CheckYesOrNo}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="isHandle"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="isHandle"
                                        initValue={row.isHandle}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isHandle"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.Person}
                                        allowNull={row.isHandle === 0}
                                        isEdit={isEdit && row.isHandle === 1}
                                        itemShowName="issueOwner"
                                        itemKey="issueOwner"
                                        initValue={row.issueOwner}
                                        errInfo={rowErrs.issueOwner}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="issueOwner"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.DateTime}
                                        allowNull={row.isHandle === 0}
                                        isEdit={isEdit && row.isHandle === 1}
                                        itemShowName="handleStartTime"
                                        errInfo={rowErrs.handleStartTime}
                                        itemKey="handleStartTime"
                                        initValue={row.handleStartTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handleStartTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={ScDataTypeList.DateTime}
                                        allowNull={row.isHandle === 0}
                                        isEdit={isEdit && row.isHandle === 1}
                                        itemShowName="handleEndTime"
                                        errInfo={rowErrs.handleEndTime}
                                        itemKey="handleEndTime"
                                        initValue={row.handleEndTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handleEndTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                    />
                                </>
                                : null
                            }
                        </ScVoucherBody>
                        <ScVoucherFooter
                            isFooterErr={false}
                            buttonPosition={buttonPosition}
                            title={"voucherFooter"}
                            theme={theme}
                            t={t}
                        >
                            <ScInput
                                dataType={ScDataTypeList.Person}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.DateTimeDisp}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.Person}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.DateTimeDisp}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.Person}
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
                            />
                            <ScInput
                                dataType={ScDataTypeList.DateTimeDisp}
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
                            />
                        </ScVoucherFooter>
                    </ScrollView>
                    {isEdit
                        ? <Surface style={{ minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center", justifyContent: "flex-end" }}>
                            {canTempSave
                                ? <Button mode="text" onPress={handleTempSave} icon="cellphone-arrow-down" >{t("draft")}</Button>
                                : null
                            }
                            {isOffLine === 0
                                ? <Button mode="text" icon="cloud-upload" onPress={handleUpload} disabled={dataErrs.isErr}>{t("upload")}</Button>
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
        </SafeAreaView >
    );
};

export default EditExecutionOrder;
