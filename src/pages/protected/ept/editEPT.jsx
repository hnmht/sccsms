import { useEffect, useState } from "react";
import {
    Stack,
    Grid,
    Typography,
    DialogActions,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CopyAddRowIcon, DeleteRowIcon } from "../../../component/PubIcon/PubIcon";
import { cloneDeep } from "lodash";

import ScInput from "../../../component/ScInput";
import Loader from "../../../component/Loader/Loader";
import { MultiSortByArr } from "../../../utils/tools";
import { reqAddEPT, reqEditEPT, reqCheckEPTCode } from "../../../api/ept";
import { message } from "mui-message";
import { voucherRow } from "./voucherConstructor";
import { transEPTToBackend } from "../../../storage/db/db";
import { bodyColumns } from "./voucherConstructor";
import { EpochTime } from "../../../i18n/dayjs";
import { getCurrentPerson, generateVoucherErrors, checkVoucherErrors } from "../pub/pubFunction";
import { ScVoucherBody, ScVoucherBodyRow } from "../../../component/ScVoucher";

// User Defined Category default value
const zeroUDC = { id: 0, code: "", name: "", description: "", isLevel: 0 };
// Generate EPT initial values
const getInitialValues = async (oriEPT, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newEPT = {};
    if (isNew) { // Add a new EPT        
        if (oriEPT) { // Copy add based on the original EPT
            newEPT = cloneDeep(oriEPT);
            newEPT.id = 0;
            newEPT.code = "";
            newEPT.creator = person;
            newEPT.createDate = currentDate;
            newEPT.modifier = { id: 0, code: "", name: "" };
            newEPT.modifyDate = EpochTime;
            newEPT.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                return row;
            });
        } else { // Add a new EPT   
            newEPT = {
                id: 0,
                code: "",
                name: "",
                description: "",
                status: 0,
                allowAddRow: 0,
                allowDelRow: 0,
                creator: person,
                createDate: currentDate,
                modifier: { id: 0, code: "", name: "" },
                modifyDate: EpochTime,
                dr: 0,
                body: [
                    voucherRow
                ],
            };
        }
    } else {
        if (!oriEPT) {
            return
        } else {
            if (isModify) { // Modify existing EPT
                newEPT = cloneDeep(oriEPT);
                newEPT.modifier = person;
                newEPT.modifyDate = currentDate;
            } else { // View existing EPT
                newEPT = cloneDeep(oriEPT);
            }
        }
    }
    return newEPT;
};

// Add or Edit or View EPT dialog
const EditEPT = ({ isOpen, isNew, isModify, oriEPT, onCancel, onOk }) => {
    const [voucherData, setVoucherData] = useState((undefined));
    const [errors, setErrors] = useState(() => generateVoucherErrors(oriEPT ? oriEPT.body.length : 1));
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();
    useEffect(() => {
        async function initVoucher() {
            const newEPT = await getInitialValues(oriEPT, isNew, isModify);
            setVoucherData(newEPT);
        }
        if (isOpen) {
            initVoucher();
        }
    }, [isOpen, oriEPT, isModify, isNew]);
    // Process after the ScInput component gets the value
    const handleGetValue = async (value, itemKey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit || !isOpen) {
            return
        }
        // Change voucherData
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                // if positionID=0, it means the field is in the header
                case 0:
                    if (itemKey === "allowDelRow") {
                        newData.body.map(row => row.allowDelRow = value);
                    }
                    console.log(itemKey,":", value);
                    newData[itemKey] = value;
                    break;
                case 1:
                    // If PositionID=1, it means the field is in the body
                    if (itemKey === "epa" && value.id !== 0 && value.id !== prevState.body[rowIndex].epa.id) {
                        // Change epa field, then change related fields
                        newData.body[rowIndex].allowDelRow = newData.allowDelRow;
                        newData.body[rowIndex].defaultValue = value.defaultValue;
                        newData.body[rowIndex].description = value.description;
                        newData.body[rowIndex].defaultValueDisp = value.defaultValueDisp;
                        newData.body[rowIndex].isCheckError = value.isCheckError;
                        newData.body[rowIndex].errorValue = value.errorValue;
                        newData.body[rowIndex].errorValueDisp = value.errorValueDisp;
                        newData.body[rowIndex].isRequireFile = value.isRequireFile;
                        newData.body[rowIndex].isOnSitePhoto = value.isOnSitePhoto;
                        newData.body[rowIndex].riskLevel = value.riskLevel;
                    }
                    newData.body[rowIndex][itemKey] = value;
                    break;
                case 2:
                    // If PositionID=2, it means the field is in the footer
                    newData[itemKey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });

        // change errors
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newErrors[itemKey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemKey] = errMsg;
                    break;
                case 2:
                    newErrors[itemKey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };
    // Process after the ScInput component gets the error message
    const handleGetErr = async (value, itemKey, positionID, rowIndex, errMsg) => {
        // change errors
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            switch (positionID) {
                case 0:
                    newErrors[itemKey] = errMsg;
                    break;
                case 1:
                    newErrors.body[rowIndex][itemKey] = errMsg;
                    break;
                case 2:
                    newErrors[itemKey] = errMsg;
                    break;
                default:
                    break;
            }
            return newErrors;
        });
    };
    // Actions after clicking Add Row button
    const handleAddRow = () => {
        // Generate new row
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        // Populate the new row's allowDelRow with the header's allowDelRow
        newRow.allowDelRow = newVoucherData.allowDelRow;
        // Auto-generate row number
        if (newVoucherData.body.length === 1) { // If there is only one row in the body
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);

        // Generate error information data
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);
    };
    // Add row by a copy of the current row
    const handleCopyAddRow = (index) => {
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherData.body[index]);
        // Generate error information data
        let newErrors = cloneDeep(errors);
        newErrors.body.push({});
        setErrors(newErrors);

        // Auto-generate row number
        if (newVoucherData.body.length === 1) { // If there is only one row in the body
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        // Reset id and hid to 0
        newRow.id = 0;
        newRow.hid = 0;
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
    };
    // Delete the current row
    const handleDeleteRow = (index, row) => {
        if (voucherData.body.length === 1) {
            message.error(t("cannotDeleteLastRow"));
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newErrors = cloneDeep(errors);
        if (isModify) {// If it is in modify state            
            if (row.id === 0) { // If it is a newly added row, delete it directly
                newVoucherData.body.splice(index, 1);
                newErrors.body.splice(index, 1);
            } else { // If it is an existing row, set the delete flag
                newVoucherData.body[index].dr = 1;
                newErrors.body[index] = {};
            }
        } else { // it is in new state
            newVoucherData.body.splice(index, 1);
            newErrors.body.splice(index, 1);
        }
        setErrors(newErrors);
        setVoucherData(newVoucherData);

    };
    // Add or Edit EPT
    const handleAddEPT = async () => {
        // Transform the voucherData to the data structure required by the backend
        const thisEPT = transEPTToBackend(voucherData);
        if (isModify) {
            let editRes = await reqEditEPT(thisEPT);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk()
            }
        } else {
            let addRes = await reqAddEPT(thisEPT);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };
    // Check if the EPT code exsst
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let docId = voucherData.id ? voucherData.id : 0;
        let checkResp = await reqCheckEPTCode({ id: docId, code: value });
        if (checkResp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.data.statusMsg };
        }
        return err;
    };

    return voucherData !== undefined
        ? <Stack component="div" id="eidtEPT" sx={{ overflowX: "hidden", overflowY: "hidden", p: 2 }}>
            <Stack component={"div"} id="voucherTitle" sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 2 }}>
                <Typography variant="h3" component={"h3"}>{t("ept")}</Typography>
            </Stack>
            <Stack component="div" id="voucherHead" sx={{ p: 2 }}>
                <Grid container id="VoucherHeader" spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="code"
                            itemKey="code"
                            initValue={voucherData.code}
                            pickDone={handleGetValue}
                            placeholder="codePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={voucherData.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
                            key="name"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={voucherData.description}
                            pickDone={handleGetValue}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            key="description"
                            positionID={0}
                            isMultiline={false}
                            rowNumber={1}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={403}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="allowAddRow"
                            itemKey="allowAddRow"
                            initValue={voucherData.allowAddRow}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="allowAddRow"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={403}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="allowDelRow"
                            itemKey="allowDelRow"
                            initValue={voucherData.allowDelRow}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="allowDelRow"
                            positionID={0}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={voucherData.status}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="status"
                            positionID={0}
                            rowIndex={-1}
                            color="warning"
                        />
                    </Grid>
                </Grid>
            </Stack>
            <ScVoucherBody bodyColumns={bodyColumns} addRowAction={handleAddRow} addRowVisible={isEdit}>
                <ScVoucherBodyRow>
                    {voucherData.body.map((row, index) => {
                        return row.dr === 0
                            ? (<tr key={"bodyrow" + row.rowNumber}>
                                <td>
                                    <Tooltip title={t("copyAddRow")} key={`rowCopyAdd${index}`}>
                                        <span>
                                            <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleCopyAddRow(index)} disabled={!isEdit}>
                                                <CopyAddRowIcon color={isEdit ? "success" : "transparent"} fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title={t("deleteRow")} key={`rowDelete${index}`}>
                                        <span>
                                            <IconButton size="small" sx={{ width: 40, height: 40 }} onClick={() => handleDeleteRow(index, row)} disabled={!isEdit}>
                                                <DeleteRowIcon color={isEdit ? "error" : "transparent"} fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </td>
                                <td>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="rowNumber"
                                        itemKey="rowNumber"
                                        initValue={row.rowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="rowNumber"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={560}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="epa"
                                        itemKey="epa"
                                        initValue={row.epa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="epa"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={590}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="riskLevel"
                                        itemKey="riskLevel"
                                        initValue={row.riskLevel}
                                        pickDone={handleGetValue}
                                        pickErr={handleGetErr}
                                        isBackendTest={false}
                                        key="riskLevel"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="allowDelRow"
                                        itemKey="allowDelRow"
                                        initValue={row.allowDelRow}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="allowDelRow"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="description"
                                        itemKey="description"
                                        initValue={row.description}
                                        pickDone={handleGetValue}
                                        placeholder="descriptionPlaceholder"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={row.epa.resultType.id}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="defaultValue"
                                        itemKey="defaultValue"
                                        initValue={row.defaultValue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="defaultValue"
                                        positionID={1}
                                        rowIndex={index}
                                        udc={row.epa.udc !== undefined ? row.epa.udc : zeroUDC}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="isCheckError"
                                        itemKey="isCheckError"
                                        initValue={row.isCheckError}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isCheckError"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={row.epa.resultType.id}
                                        allowNull={!row.isCheckError}
                                        isEdit={isEdit}
                                        itemShowName="errorValue"
                                        itemKey="errorValue"
                                        initValue={row.errorValue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="errorValue"
                                        positionID={1}
                                        rowIndex={index}
                                        udc={row.epa.udc !== undefined ? row.epa.udc : zeroUDC}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="isRequireFile"
                                        itemKey="isRequireFile"
                                        initValue={row.isRequireFile}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isRequireFile"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>
                                <td>
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="isOnSitePhoto"
                                        itemKey="isOnSitePhoto"
                                        initValue={row.isOnSitePhoto}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isOnSitePhoto"
                                        positionID={1}
                                        rowIndex={index}
                                    />
                                </td>

                            </tr>
                            )
                            : null
                    })}
                </ScVoucherBodyRow>
            </ScVoucherBody>
            <Stack component="div" id="voucherRoot">
                <Grid container id="voucherRoot" spacing={2}>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="creator"
                            itemKey="creator"
                            initValue={voucherData.creator}
                            isBackendTest={false}
                            key="creator"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="createDate"
                            itemKey="createDate"
                            initValue={voucherData.createDate}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="createDate"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifier"
                            itemKey="modifier"
                            initValue={voucherData.modifier}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="modifier"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifyDate"
                            itemKey="modifyDate"
                            initValue={voucherData.modifyDate}
                            key="modifyDate"
                            positionID={2}
                            rowIndex={-1}
                        />
                    </Grid>
                </Grid>
            </Stack>
            <DialogActions sx={{ m: 1 }}>
                {isEdit
                    ? <>
                        <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                        <Button variant="contained" disabled={checkVoucherErrors(errors)} onClick={handleAddEPT}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }

            </DialogActions>
        </Stack>
        : <Loader />

};

export default EditEPT;