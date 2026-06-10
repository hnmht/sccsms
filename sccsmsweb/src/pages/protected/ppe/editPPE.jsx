import { useState, useEffect } from 'react';
import {
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    Button,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { message } from 'mui-message';
import { cloneDeep } from 'lodash';
import { EpochTime } from '../../../i18n/dayjs';

import { Divider } from '../../../component/ScMui/ScMui';
import Loader from '../../../component/Loader/Loader';
import ScInput from '../../../component/ScInput';
import MoreInfo from "../../../component/MoreInfo/MoreInfo";
import { reqAddPPE, reqEditPPE, reqCheckPPECode } from '../../../api/ppe';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';


// Get initial PPE
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriPPE } = diagStatus;
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newPPE = {};
    if (isNew) {
        if (oriPPE) {// Copy Add
            newPPE = cloneDeep(oriPPE);
            newPPE.id = 0;
            newPPE.code = "";
            newPPE.creator = person;
            newPPE.modifier = { id: 0, code: "", name: "" };
            newPPE.createDate = currentDate;
            newPPE.modifyDate = EpochTime;
        } else {
            newPPE = { // Add
                id: 0,
                code: "",
                name: "",
                model: "",
                unit: "",
                description: "",
                status: 0,
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (!oriPPE) { // Error
            return
        } else {
            if (isModify) {// Edit
                newPPE = cloneDeep(oriPPE);
                newPPE.modifier = person;
                newPPE.modifyDate = currentDate;
            } else { // Detail
                newPPE = cloneDeep(oriPPE);
            }
        }
    }
    return newPPE;
};

// Add, Modify Personal Protective Equipment 
const EditPPE = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentPPE, setCurrentPPE] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const initPPE = await getInitialValues(diagStatus);
            setCurrentPPE(initPPE);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    // Date processing actions after the data is passed into the ScInput Components
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentPPE === undefined) {
            return
        }
        // Changeerrors value
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentPPE value
        setCurrentPPE((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    // Add or Modify PPE 
    const handleAddPPE = async () => {
        let thisPPE = cloneDeep(currentPPE);
        delete thisPPE.createDate;
        delete thisPPE.modifyDate;
        if (isModify) {// Modify
            const editRes = await reqEditPPE(thisPPE);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {// Add
            const addRes = await reqAddPPE(thisPPE);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
        // Sync the frent-end cache with server
        await InitDocCache("ppe");
    }
    // Check if the PPE Code exists
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let opId = currentPPE.id ? currentPPE.id : 0;
        let resp = await reqCheckPPECode({ id: opId, "code": value }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    return currentPPE
        ? <>
            <DialogTitle>{t(isNew ? "addPPE" : isModify ? "modifyPPE" : "viewPPE")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="code"
                            itemKey="code"
                            initValue={currentPPE.code}
                            pickDone={handleGetValue}
                            placeholder="codePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentPPE.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="model"
                            itemKey="model"
                            initValue={currentPPE.model}
                            pickDone={handleGetValue}
                            placeholder="modelPlaceholder"
                            isBackendTest={false}
                            key="model"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="unit"
                            itemKey="unit"
                            initValue={currentPPE.unit}
                            pickDone={handleGetValue}
                            placeholder="unitPlaceholder"
                            isBackendTest={false}
                            key="unit"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentPPE.description}
                            pickDone={handleGetValue}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={currentPPE.status}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="status"
                            isBackendTest={false}
                            color="warning"
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
                            initValue={currentPPE.creator}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="creator"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="createDate"
                            itemKey="createDate"
                            initValue={currentPPE.createDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="createDate"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifier"
                            itemKey="modifier"
                            initValue={currentPPE.modifier}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="modifier"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <ScInput
                            dataType={309}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="modifyDate"
                            itemKey="modifyDate"
                            initValue={currentPPE.modifyDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="modifyDate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddPPE}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{(t("back"))}</Button>
                }
            </DialogActions>
        </>
        : <Loader />

};

export default EditPPE;