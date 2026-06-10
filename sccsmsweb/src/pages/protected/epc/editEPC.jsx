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

import { reqCheckEPCName, reqAddEPC, reqEditEPC } from '../../../api/epc';
import { findChildrens } from '../../../utils/tree';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { GetLocalCache } from '../../../storage/db/db';

// Generate initial Execution Project Category
const getInitialValues = async (oriDoc, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newDoc = {
        id: 0,
        name: "",
        description: "",
        fatherID: { id: 0, name: "" },
        status: 0,
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime,
    };
    if (isNew) {// Add or CopyAdd
        if (oriDoc) { // Copy item for add
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
            } else { // Detail
                newDoc = cloneDeep(oriDoc);
            }
        }
    }
    return newDoc;
};

// Add, Edit, View Execution Project Category
const EditEPC = ({ isOpen, isNew, isModify, oriDoc, onCancel, onOk }) => {
    const [currentDoc, setCurrentDoc] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initDoc() {
            const newDoc = await getInitialValues(oriDoc, isNew, isModify);
            setCurrentDoc(newDoc);
        }
        if (isOpen) {
            initDoc();
        }
    }, [isOpen, isNew, isModify, oriDoc]);

    // Data processing actions after the data is passed into the ScInput Components 
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentDoc === undefined || !isOpen || !isEdit) {
            return
        }
        // Change Errors value
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentDoc value
        setCurrentDoc((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    }, [currentDoc, isOpen, isEdit]);
    // CHeck if the EPC name exists
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let resp = await reqCheckEPCName({ id: currentDoc.id, "name": value });
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    // Check if the parent category is compliant
    const handleCheckHigherClass = async (value) => {
        let err = { isErr: false, msg: "" };
        // If is a new addition, directly exit
        if (isNew) {
            return err;
        }
        //If the parent category is equal to the current category.
        if (currentDoc.id === value.id) {
            err = { isErr: true, msg: "parentCannotItself" };
            return err
        } 
        // Get all epcs from the front-end category
        const epcs = await GetLocalCache("epc");
        // Get all subcategories
        const childrens = findChildrens(epcs, currentDoc.id);
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

    // Add or Edit EPC
    const handleAddEPC = async () => {
        let thisDoc = cloneDeep(currentDoc);
        delete thisDoc.createDate;
        delete thisDoc.modifyDate;
        if (isModify) {// Edit EPC            
            const editRes = await reqEditEPC(thisDoc);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {// Add EPC            
            const addRes = await reqAddEPC(thisDoc);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    }

    return currentDoc
        ? <>
            <DialogTitle>{isNew ? t("addCategory") : isModify ? t("modifyCategory") : t("viewCategory")}</DialogTitle>
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
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={540}
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
                        />
                    </Grid>
                </MoreInfo>
            </DialogContent>
            <Divider />
            <DialogActions>
                {isEdit
                    ? <>
                        <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddEPC}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};
export default EditEPC;
