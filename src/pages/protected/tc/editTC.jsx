import { useState, useCallback, useEffect } from 'react';
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
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';

import { reqAddTC, reqEditTC, reqCheckTCName } from '../../../api/tc';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
// body files initial value
const bodyFiles = {
    id: 0,
    billbid: 0,
    billhid: 0,
    file: { fileid: 0, filehash: "" },
    dr: 0,
};
// Get Training Course initial values
const getInitialValues = async (oriDoc, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newDoc = { // Add
        id: 0,
        code: "",
        name: "",
        classHour: 1.0,
        isExamine: 1,
        description: "",
        status: 0,
        files: [bodyFiles],
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime
    };

    if (isNew) {
        if (oriDoc) {// Copy Add
            newDoc = {
                ...oriDoc,
                id: 0,
                name: "",
                files: [bodyFiles],
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (oriDoc) {
            if (isModify) { // Edit
                newDoc = {
                    ...oriDoc,
                    modifier: person,
                    modifyDate: currentDate
                };
            } else {// Detail
                newDoc = { ...oriDoc };
            }
        }
    }
    return newDoc;
};

// Add & Edit & View Training Course
const EditTC = ({ isOpen, isNew, isModify, oriDoc, onCancel, onOk }) => {
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const newDoc = await getInitialValues(oriDoc, isNew, isModify);
            setCurrentDoc(newDoc);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriDoc, isNew, isModify]);

    // Data processing after getting value from scInput component
    const handleGetValue = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        // Change currentDoc value
        setCurrentDoc((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
        // Change errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentDoc, isOpen, isEdit]);

    // Data processing after getting error message from scInput component
    const handleGetError = useCallback((value, itemkey, positionID, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        // Change errors       
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
    }, [currentDoc, isOpen, isEdit]);
    // Check if Training Course name is duplicate
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckTCName({ id: currentDoc.id, "name": value }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    // Add or Edit Training Course
    const handleAddDoc = async () => {
        let thisDoc = cloneDeep(currentDoc);
        delete thisDoc.createDate;
        delete thisDoc.modifyDate;
        if (isModify) {
            let editRes = await reqEditTC(thisDoc);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddTC(thisDoc);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };

    return currentDoc
        ? <>
            <DialogTitle>{t(isNew ? "addTC" : isModify ? "modifyTC" : "viewTC")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ width: "100%", height: "100%" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentDoc.name}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="namePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            key="name"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={302}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="classHour"
                            itemKey="classHour"
                            initValue={currentDoc.classHour}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="classHourPlaceholder"
                            isBackendTest={false}
                            key="classHour"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={404}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="isExamine"
                            itemKey="isExamine"
                            initValue={currentDoc.isExamine}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder=""
                            isBackendTest={false}
                            key="isExamine"
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
                            initValue={currentDoc.description}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={4}
                            key="description"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={902}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="files"
                            itemKey="files"
                            initValue={currentDoc.files}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            placeholder="filesPlaceholder"
                            isBackendTest={false}
                            key="files"
                            positionID={0}
                            chooseType={"*"}
                            fileMaxSize={60}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={currentDoc.status}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
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
                            initValue={currentDoc.creator}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
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
                            initValue={currentDoc.createDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
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
                            initValue={currentDoc.modifier}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
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
                            initValue={currentDoc.modifyDate}
                            pickDone={handleGetValue}
                            pickErr={handleGetError}
                            isBackendTest={false}
                            key="modifyDate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddDoc}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditTC;