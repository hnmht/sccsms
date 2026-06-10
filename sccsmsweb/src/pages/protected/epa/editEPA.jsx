import { useState, useCallback, useEffect } from 'react';
import {
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    Button,
} from "@mui/material";
import { message } from 'mui-message';
import { cloneDeep } from 'lodash';
import { EpochTime } from '../../../i18n/dayjs';

import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';

import { GetDataTypeDefaultValue } from "../../../storage/dataTypes";
import { transEPToBackend } from "../../../storage/db/db";
import { reqAddEP, reqCheckEPCode, reqEditEP } from '../../../api/epa';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { useTranslation } from 'react-i18next';

// Generate initial Execution Project 
const getInitialValues = async (oriEP, isNew, isModify, currentEPC) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newEP = { // add
        id: 0,
        code: "",
        name: "",
        epc: currentEPC,
        description: "",
        status: 0,
        resultType: { id: 301, name: "text", dataType: "string", inputMode: "Input" },
        udc: { id: 0, name: "", description: "" },
        defaultValue: "",
        isCheckError: 0,
        errorValue: "",
        isRequireFile: 0,
        isOnSitePhoto: 0,
        riskLevel: { id: 0, name: "", color: "white", description: "" },
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime
    };

    if (isNew) {
        if (oriEP) {// Copy and add
            newEP = {
                ...oriEP,
                id: 0,
                code: "",
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (oriEP) {
            if (isModify) { // Edit
                newEP = {
                    ...oriEP,
                    modifier: person,
                    modifyDate: currentDate
                };
            } else {// View Detail
                newEP = { ...oriEP };
            }
        }
    }
    return newEP;
};
// Add, Edit, View Execution Project
const EditEP = ({ isOpen, isNew, isModify, oriEP, EPC, onCancel, onOk }) => {
    const [currentEP, setCurrentEP] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const newEid = await getInitialValues(oriEP, isNew, isModify, EPC);
            setCurrentEP(newEid);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriEP, isNew, isModify, EPC]);

    // Data processing actions after the data is passed into the ScInput components
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentEP === undefined || !isOpen || !isEdit) {
            return
        }
        // Change currentEP value
        setCurrentEP((prevState) => {
            let newValue = cloneDeep(prevState);
            // If the resultType field is modified and its value has changed
            if (itemkey === "resultType" && value.id !== prevState.resultType.id) {
                // Modify the defaultValue                                 
                newValue.defaultValue = GetDataTypeDefaultValue(value.id);
                newValue.errorValue = GetDataTypeDefaultValue(value.id);
                if (prevState.resultType.id === 550) { // If the previous value of resultType was 550                  
                    newValue.udc = { id: 0, name: "", description: "" };
                }
            }
            newValue[itemkey] = value;

            return newValue;
        });
        // Change errors value       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentEP, isOpen, isEdit]);

    // Errors data processing actions after the error is passed into the ScInput components
    const handleGetError = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentEP === undefined || !isOpen || !isEdit) {
            return
        }
        // change errors value       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentEP, isOpen, isEdit]);

    // Add Or Edit Execution Project
    const handleAddEP = async () => {
        let thisEP = transEPToBackend(currentEP);
        delete thisEP.createDate;
        delete thisEP.modifyDate;

        if (isModify) {
            let editRes = await reqEditEP(thisEP);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddEP(thisEP);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };
    // Check if the EP Code exists
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let checkResp = await reqCheckEPCode({ id: currentEP.id, epc: EPC, code: value }, false);

        if (checkResp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.data.statusMsg };
        }
        return err;
    };

    return currentEP
        ? <>
            <DialogTitle>{t(isNew ? "addEP" : isModify ? "modifyEP" : "viewEP")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="code"
                            itemKey="code"
                            initValue={currentEP.code}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="codePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentEP.name}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentEP.description}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={540}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="epc"
                            itemKey="epc"
                            initValue={currentEP.epc}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6} >
                        <ScInput
                            dataType={590}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="riskLevel"
                            itemKey="riskLevel"
                            initValue={currentEP.riskLevel}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Divider />
                    <Grid item xs={4} >
                        <ScInput
                            dataType={101}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="resultType"
                            itemKey="resultType"
                            initValue={currentEP.resultType}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <ScInput
                            dataType={530}
                            allowNull={currentEP.resultType.id !== 550}
                            isEdit={currentEP.resultType.id === 550 && isEdit}
                            itemShowName="udc"
                            itemKey="udc"
                            initValue={currentEP.udc}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                            rowIndex={0}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <ScInput
                            dataType={currentEP.resultType.id}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="defaultValue"
                            itemKey="defaultValue"
                            initValue={currentEP.defaultValue}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            udc={currentEP.udc}
                            positionID={0}
                            rowIndex={0}
                        />
                    </Grid>
                    <Divider />
                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="isCheckError"
                            itemKey="isCheckError"
                            pickErr={handleGetError}
                            initValue={currentEP.isCheckError}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={8} >
                        <ScInput
                            dataType={currentEP.resultType.id}
                            allowNull={currentEP.isCheckError === 0}
                            isEdit={isEdit}
                            itemShowName="errorValue"
                            itemKey="errorValue"
                            initValue={currentEP.errorValue}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            udc={currentEP.udc}
                            positionID={0}
                            rowIndex={1}
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="isRequireFile"
                            itemKey="isRequireFile"
                            initValue={currentEP.isRequireFile}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                        />
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="isOnSitePhoto"
                            itemKey="isOnSitePhoto"
                            initValue={currentEP.isOnSitePhoto}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={402}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={currentEP.status}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            color="warning"
                            positionID={0}
                        />
                    </Grid>
                </Grid>
                <MoreInfo>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="creator"
                            itemKey="creator"
                            initValue={currentEP.creator}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="createDate"
                            itemKey="createDate"
                            initValue={currentEP.createDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifier"
                            itemKey="modifier"
                            initValue={currentEP.modifier}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifyDate"
                            itemKey="modifyDate"
                            initValue={currentEP.modifyDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddEP}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditEP;