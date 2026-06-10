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

import { reqCheckDCName, reqAddDC, reqEditDC } from '../../../api/dc';
import { findChildrens } from '../../../utils/tree';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { GetLocalCache } from '../../../storage/db/db';

// Generate initialize the values of the document category form
const getInitialValues = async (oriDoc, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newDoc = {
        id: 0,
        name: "",
        description: "",
        fatherID: { id: 0, name: "", description: "", fatherID: 0, status: 0 },
        status: 0,
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime,
    };
    if (isNew) {// Add or copy add
        if (oriDoc) { // Copy add
            newDoc = cloneDeep(oriDoc);
            newDoc.id = 0;
            newDoc.name = "";
            newDoc.creator = person;
            newDoc.modifier = { id: 0, code: "", name: "" };
            newDoc.createDate = currentDate;
            newDoc.modifyDate = EpochTime;
        }
    } else {
        if (oriDoc) {
            if (isModify) { // Edit
                newDoc = cloneDeep(oriDoc);
                newDoc.modifier = person;
                newDoc.modifyDate = currentDate;
            } else { // View details
                newDoc = cloneDeep(oriDoc);
            }
        }
    }
    return newDoc;
};

// Add/Edit/View Document Category Dialog
const EditDC = ({ isOpen, isNew, isModify, oriDoc, onCancel, onOk }) => {
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation()

    useEffect(() => {
        async function initDoc() {
            const newDoc = await getInitialValues(oriDoc, isNew, isModify);
            setCurrentDoc(newDoc);
        }
        if (isOpen) {
            initDoc();
        }
    }, [isOpen, isNew, isModify, oriDoc]);

    // Data received from child component
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        // Change errors state
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentDoc state
        setCurrentDoc((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    }, [currentDoc, isOpen, isEdit]);
    // Check if the DC Name is existed
    // Backend validation function for ScInput component
    // Must return a promise that resolves to an object {isErr: boolean, msg: string}
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckDCName({ id: currentDoc.id, "name": value });
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.data.msg };
        }
        return err;
    };

    // Check if the parent category is valid    
    const handleCheckHigherClass = async (value) => {
        let err = { isErr: false, msg: "" };
        // If it is a new category, no need to check
        if (isNew) {
            return err;
        }
        // If the parent category is equal to itself, return error
        if (currentDoc.id === value.id) {
            err = { isErr: true, msg: "parentCannotItselt" };
            return err
        }
        // Get DC list from local cache
        const dcs = await GetLocalCache("dc");
        // Find all children of the current category, 
        // if the selected parent category is one of its children, return error
        const childrens = findChildrens(dcs, currentDoc.id);
        let pNum = 0;
        childrens.forEach(child => {
            if (child.id === value.id) {
                pNum++
            }
        })
        if (pNum > 0) {
            err = { isErr: true, msg: "parentCannotBeChild" }
        }
        return err;
    }

    // Add or Edit the document category
    const handleAddDoc = async () => {
        let thisDoc = cloneDeep(currentDoc);
        delete thisDoc.createDate;
        delete thisDoc.modifyDate;

        if (isModify) {// Edit         
            const editRes = await reqEditDC(thisDoc);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {// Add  
            const addRes = await reqAddDC(thisDoc);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };

    return currentDoc
        ? <>
            <DialogTitle>{t(isNew ? "addCategory" : isModify ? "modifyCategory" : "viewCategory")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2, maxHeight: 768 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentDoc.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            key="name"
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
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={600}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="parentCategory"
                            itemKey="fatherID"
                            initValue={currentDoc.fatherID}
                            pickDone={handleGetValue}
                            placeholder="categoryPlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleCheckHigherClass}
                            isMultiline={false}
                            rowNumber={1}
                            key="fatherID"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={currentDoc.status}
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
                            initValue={currentDoc.creator}
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
                            initValue={currentDoc.createDate}
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
                            initValue={currentDoc.modifier}
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
                            initValue={currentDoc.modifyDate}
                            pickDone={handleGetValue}
                            isBackendTest={false}
                            key="modifyDate"
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddDoc}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditDC;
