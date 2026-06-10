import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, ActivityIndicator, IconButton, useTheme, Button, Surface } from "react-native-paper";
import { dayjs } from "../../i18n/dayjs";
import ScInput from "../../components/ScInput";
import { ScVoucherHeader, ScVoucherFooter, ScVoucherBody } from "../../components/ScVoucher";
import { multiSortByArr } from "../../components/tools/sort";
import { getInitialValue, checkWOErrors, transWOToBackend } from "./constructor";
import { reqEditWO, reqAddWO } from "../../api/workOrder";
import { cloneDeep } from "lodash";
import { useAppSelector } from "../../store/hooks";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import { getDefaultWorkOrderRow } from "../../dataType/dataZero/workOrder";
import { WorkOrder, WorkOrderRow } from "../../dataType/types/workOrder";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { WORepo } from "../../db/crud/workorder";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { SafeAreaView } from "react-native-safe-area-context";
import WOBodyMenu from "./WOBodyMenu";
import { useTranslation } from "react-i18next";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";

function EditWorkOrder() {
    const navigation = useBusinessNavigation<"WorkOrder">();
    const theme = useTheme();
    const route = useBusinessRoute<"WorkOrder">();
    const { isLocal = false, isNew = false, isModify = false, oriWO = undefined, onGoBack } = route.params ?? {};
    const { t } = useTranslation();
    const { person, department } = useAppSelector(state => state.user);
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const [voucherData, setVoucherData] = useState<WorkOrder | undefined>((undefined));
    const [deletedRows, setDeletedRows] = useState<WorkOrderRow[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const isEdit = !(!isModify && !isNew);
    const canTempSave = isLocal ? true : isModify ? false : true;
    // Command Button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    // Check VoucherData Errors
    const dataErrs = useMemo(() => checkWOErrors(voucherData), [voucherData]);
    // Generate Work Order Data
    useEffect(() => {
        async function initVoucher() {
            const newWO = await getInitialValue(oriWO, isNew, isModify, person, department);
            setVoucherData(newWO);
        }
        initVoucher();
    }, [oriWO, isModify, isNew]);

    // Actions upon receiving values from  ScInput Components
    const handleGetValue = async  <T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (voucherData === undefined || !isEdit) {
            return
        }
        // Update Work Order data
        setVoucherData((prevState) => {
            let newData: any = cloneDeep(prevState);
            if (newData === undefined) {
                return
            }
            switch (positionID) {
                case 0:// Update header data
                    newData[itemKey] = value;
                    break;
                case 1:// Update body data                                       
                    newData.body[rowIndex][itemKey] = value;
                    break;
                case 2: // Update footer data
                    newData[itemKey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });

    };
    // Actions upon press addRow button
    const handleAddRow = () => {
        if (voucherData === undefined) {
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        // Generate default row data
        let newRow = getDefaultWorkOrderRow(newVoucherData?.creator, newVoucherData?.department, newVoucherData?.createDate);
        // Automatically generate row number
        if (newVoucherData.body.length === 1) {
            // If the body has only one row, set the row number to 10
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            // If the body contains more than one row, sort it by row number in ascending order
            newVoucherData.body.sort(multiSortByArr([{ field: "rowNumber", order: "asc" }]));
            // Set the row number to the maximum row number plus 10
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Automatically fill in the start time and end time
        if (dayjs(newVoucherData.workDate).isValid()) {
            newRow.startTime = dayjs(newVoucherData.workDate).startOf("day").add(9, "hour").toISOString();
            newRow.endTime = dayjs(newVoucherData.workDate).startOf("day").add(17, "hour").toISOString();
        } else {
            newRow.startTime = dayjs(new Date()).startOf("day").add(9, "hour").toISOString();
            newRow.endTime = dayjs(new Date()).startOf("day").add(17, "hour").toISOString();
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newVoucherData.body.length - 1);
    };
    // Actions upon press copy add row button
    const handleCopyAddRow = () => {
        if (voucherData === undefined) {
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherData.body[currentRowIndex]);
        // Automatically generate row number
        if (newVoucherData.body.length === 1) {
            // If the body has only one row, set the row number to 10 (That won't happen at all)
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            // If the body contains more than one row, sort it by row number in ascending order
            newVoucherData.body.sort(multiSortByArr([{ field: "rowNumber", order: "asc" }]));
            // Set the row number to the maximum row number plus 10
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Modify ID and HID values
        newRow.id = 0;
        newRow.hid = 0;
        // Automatically fill in the start time and end time
        if (dayjs(newVoucherData.workDate).isValid()) {
            newRow.startTime = dayjs(newVoucherData.workDate).startOf("day").add(9, "hour").toISOString();
            newRow.endTime = dayjs(newVoucherData.workDate).startOf("day").add(17, "hour").toISOString();
        } else {
            newRow.startTime = dayjs(new Date()).startOf("day").add(9, "hour").toISOString();
            newRow.endTime = dayjs(new Date()).startOf("day").add(17, "hour").toISOString();
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newVoucherData.body.length - 1);
    };
    // Actions upon press delete row button
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
            // Determine if the row was added in edit mode
            if (row.id === 0) {
                // Directly delete row added in editmode
                newVoucherData.body.splice(currentRowIndex, 1);
            } else { // Handle the deletion of existing rows in edit mode
                // Modify the deletion flag for this row
                newVoucherData.body[currentRowIndex].dr = 1;
                // Staging deleted rows
                newDeletedRows.push(newVoucherData.body[currentRowIndex]);
                // Delete row in voucher data body
                newVoucherData.body.splice(currentRowIndex, 1);
            }
        } else {
            // Directly delete row added in add mode
            newVoucherData.body.splice(currentRowIndex, 1);
        }
        // If the deleted row was the last one, set the current row to the new last row of the body
        if (newRowIndex > (newVoucherData.body.length - 1)) {
            newRowIndex = newVoucherData.body.length - 1;
        }
        setDeletedRows(newDeletedRows);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newRowIndex);
    };

    // Actions upon press cancel button
    const handleCancel = () => {
        if (onGoBack) {
            onGoBack(false);
        }
        navigation.goBack();
    };

    // Actions upon press upload button
    const handleUploadWO = async () => {
        if (voucherData === undefined) {
            return
        }
        let newWO = cloneDeep(voucherData);
        // Merge staged deleted rows into the work order body
        if (isModify && deletedRows.length > 0) {
            newWO.body.push(...deletedRows);
        }
        // Convert the WorkOrder object into a backend-compatible format
        const thisWO = transWOToBackend(newWO);
        if (isModify) {
            if (isLocal) { // Edit locally staged Work Order in edit mode
                // let localID = thisWO.id;
                thisWO.id = 0;
                delete thisWO.errData;
                let addRes = await reqAddWO(thisWO);
                if (addRes.status) {
                    WORepo.delVoucher(voucherData)
                    Alert.alert(t("tip"), t("addSuccessful"));
                } else {
                    return
                }
            } else { // Edit remote Work Order in edit mode
                let editRes = await reqEditWO(thisWO);
                if (editRes.status) {
                    Alert.alert(t("tip"), t("modifySuccessful"));
                } else {
                    return
                }
            }
        } else {
            let addRes = await reqAddWO(thisWO);
            if (addRes.status) {
                Alert.alert(t("tip"), t("addSuccessful"));
            } else {
                return
            }
        }
        if (onGoBack) {
            onGoBack(true);
        }
        navigation.goBack();
    };

    // Stage Work Order in the local database
    const handleTempSave = () => {
        if (voucherData === undefined) {
            return
        }
        let newVoucherData = cloneDeep(voucherData);
        // Save error information to the Work Order Object
        newVoucherData.errData = dataErrs;

        // Stage Work Order into local database
        if (isModify) {
            if (isLocal) {
                // Update Work Order data into local database
                WORepo.editVoucher(newVoucherData);
            } else {
                Alert.alert(t("err"), t("notAllowedStagRemotoVoucher"));
            }
        } else { // Add Mode
            WORepo.saveVoucher(newVoucherData, person.id)
        }

        if (onGoBack) {
            onGoBack(true);
        }
        navigation.goBack();
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <Surface key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>{t("wo")}</Text>
            </Surface>
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
                                itemKey="billNumber"
                                initValue={isLocal ? `L${voucherData.id}` : voucherData.billNumber}
                                pickDone={handleGetValue}
                                placeholder=""
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
                                errInfo={{ isErr: false, msg: "" }}
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                placeholder="deptPlaceholder"
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                            />
                            <ScInput
                                dataType={ScDataTypeList.Date}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="operationDate"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="workDate"
                                initValue={voucherData.workDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="workDate"
                                positionID={0}
                                rowIndex={-1}
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
                                color="warning"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="description"
                                errInfo={{ isErr: false, msg: "" }}
                                itemKey="description"
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                placeholder="descriptionPlaceholder"
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                                textLines={2}
                                width="100%"
                            />
                        </ScVoucherHeader>
                        <ScVoucherBody
                            isBodyErr={dataErrs.isBodyErr ?? false}
                            title="voucherBody"
                            buttonPosition={buttonPosition}
                            isEdit={isEdit}
                            addRowDisabled={false}
                            bodyMenu={<WOBodyMenu
                                woErrors={dataErrs}
                                woRows={voucherData.body}
                                setCurrentRowIndex={setCurrentRowIndex}
                                theme={theme}
                                t={t}
                            />}
                            addRowAction={handleAddRow}
                            totalRows={voucherData.body.length}
                            currentRowIndex={currentRowIndex}
                            setCurrentRowIndex={setCurrentRowIndex}
                            theme={theme}
                            t={t}
                        >
                            {voucherData.body[currentRowIndex].dr === 0
                                ? <>
                                    <View style={{ width: "100%", minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                                        <IconButton onPress={handleCopyAddRow} icon="content-copy" iconColor={theme.colors.primary} disabled={!isEdit} />
                                        <IconButton onPress={handleDeleteRow} icon="playlist-remove" iconColor={theme.colors.error} disabled={!isEdit} />
                                    </View>
                                    <ScInput
                                        dataType={ScDataTypeList.Number}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="rowNumber"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="rowNumber"
                                        initValue={voucherData.body[currentRowIndex].rowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={405}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="status"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="status"
                                        initValue={voucherData.body[currentRowIndex].status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={570}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="csa"
                                        itemKey="csa"
                                        initValue={voucherData.body[currentRowIndex].csa}
                                        errInfo={dataErrs.body[currentRowIndex].csa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="csa"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="description"
                                        errInfo={{ isErr: false, msg: "" }}
                                        itemKey="description"
                                        initValue={voucherData.body[currentRowIndex].description}
                                        pickDone={handleGetValue}
                                        placeholder="descriptionPlaceholder"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        textLines={2}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={510}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="executor"
                                        itemKey="executor"
                                        initValue={voucherData.body[currentRowIndex].executor}
                                        errInfo={dataErrs.body[currentRowIndex].executor}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executor"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={580}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="ept"
                                        itemKey="ept"
                                        initValue={voucherData.body[currentRowIndex].ept}
                                        errInfo={dataErrs.body[currentRowIndex].ept}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ept"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="startTime"
                                        itemKey="startTime"
                                        initValue={voucherData.body[currentRowIndex].startTime}
                                        errInfo={dataErrs.body[currentRowIndex].startTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="startTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="endTime"
                                        itemKey="endTime"
                                        initValue={voucherData.body[currentRowIndex].endTime}
                                        errInfo={dataErrs.body[currentRowIndex].endTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="endTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                </>
                                : null
                            }
                        </ScVoucherBody>
                        <ScVoucherFooter
                            isFooterErr={false}
                            title={"voucherFooter"}
                            buttonPosition={buttonPosition}
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
                                width={"100%"}
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
                                width={"100%"}
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
                                width={"100%"}
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
                                width={"100%"}
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
                                width={"100%"}
                            />
                        </ScVoucherFooter>
                    </ScrollView>

                    {isEdit
                        ? <Surface style={{ minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center", justifyContent: "flex-end", paddingHorizontal: 16 }}>
                            {canTempSave
                                ? <Button mode="text" icon="cellphone-arrow-down" onPress={handleTempSave}>{t("draft")}</Button>
                                : null
                            }
                            {isOffLine === 0
                                ? <Button mode="text" onPress={handleUploadWO} icon="cloud-upload" disabled={dataErrs.isErr ?? false}>{t("upload")}</Button>
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
                : <ActivityIndicator />
            }

        </SafeAreaView>
    );
};

export default EditWorkOrder;