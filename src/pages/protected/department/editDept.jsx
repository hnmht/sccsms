import { useState, useCallback, useEffect } from 'react';
import {
    DialogContent,
    DialogTitle,
    Grid,
    DialogActions,
    Button,
} from "@mui/material";
import { EpochTime } from '../../../i18n/dayjs';
import { message } from 'mui-message';
import { cloneDeep } from 'lodash';

import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';

import { reqValidateDeptCode, reqAddDept, reqEditDept } from '../../../api/department';
import { findChildrens } from '../../../utils/tree';
import { GetLocalCache } from '../../../storage/db/db';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { useTranslation } from 'react-i18next';

// Generate initial values for the department master data
const getInitialValues = async (oriDept, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newDept = {};
    if (isNew) { //Add or CopyAdd
        if (oriDept) { // Copy Add
            newDept = cloneDeep(oriDept);
            newDept.id = 0;
            newDept.code = "";
            newDept.creator = person;
            newDept.modifier = { id: 0, code: "", name: "" };
            newDept.createDate = currentDate;
            newDept.modifyDate = EpochTime;
        } else { // Add
            newDept = {
                id: 0,
                code: "",
                name: "",
                description: "",
                status: 0,
                leader: { id: 0, code: "", name: "" },
                fatherid: { id: 0, code: "", name: "" },
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (!oriDept) {
            return
        } else { // Edit or Detail
            if (isModify) { // Edit
                newDept = cloneDeep(oriDept);
                newDept.modifier = person;
                newDept.modifyDate = currentDate;
            } else { // Detail
                newDept = cloneDeep(oriDept);
            }
        }
    }
    return newDept;
};

// Add, Edit, View the department master data
const EditDept = ({ isOpen, isNew, isModify, oriDept, onCancel, onOk }) => {
    const [currentDept, setCurrentDept] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const newOridept = await getInitialValues(oriDept, isNew, isModify);
            setCurrentDept(newOridept);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriDept, isNew, isModify]);
    // Data processing actions after the data is passed into the ScInput components
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentDept === undefined || !isOpen || !isEdit) {
            return
        }
        // Refersh errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Refresh fields
        setCurrentDept((prevState) => {
            // Deep Clone
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    }, [currentDept, isOpen, isEdit]);
    // Check if the department code exists
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let uid = currentDept.id ? currentDept.id : 0;
        let resp = await reqValidateDeptCode({ id: uid, "code": value }, false);
        if (resp.status) {
            return err;
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    // Check for circular references in the parent department
    const handleCheckFatherDept = async (dept) => {
        let err = { isErr: false, msg: "" };
        // No need to check if it's a new entry
        if (isNew) {
            return err;
        };
        // The parent department cannot be itself.
        if (currentDept.id === dept.id) {
            err = { isErr: true, msg: "parentCannotItself" }
            return err;
        }
        // Get department list from front-end cache
        const depts = await GetLocalCache("department");

        // Get all subordinate departments of this department,
        // the parent department cannot be any of these.
        const childrens = findChildrens(depts, currentDept.id);
        let pNum = 0;
        childrens.forEach(children => {
            if (children.id === dept.id) {
                pNum++
            }
        })
        if (pNum > 0) {
            err = { isErr: true, msg: "parentCannotBeChild" }
        }
        return err;
    }
    // Add or edit department
    const handleAddDept = async () => {
        let thisDept = cloneDeep(currentDept);
        delete thisDept.createDate;
        delete thisDept.modifyDate;

        if (isModify) { // Edit
            const editRes = await reqEditDept(thisDept);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            } else {
                message.error(t("modifyFailed") + editRes.msg);
            }
        } else { // Add 
            const addRes = await reqAddDept(thisDept);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    }

    return (currentDept
        ? <>
            <DialogTitle>{isNew ? t("addDept") : isModify ? t("modifyDept") : t("viewDept")}</DialogTitle>
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
                            initValue={currentDept.code}
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
                            initValue={currentDept.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="parent"
                            itemKey="fatherID"
                            initValue={currentDept.fatherID}
                            pickDone={handleGetValue}
                            placeholder="chooseDeptPlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleCheckFatherDept}
                            key="fatherid"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={510}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="leader"
                            itemKey="leader"
                            initValue={currentDept.leader}
                            pickDone={handleGetValue}
                            placeholder="choosePersonPlaceholder"
                            isBackendTest={false}
                            key="leader"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentDept.description}
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
                            initValue={currentDept.status}
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
                            initValue={currentDept.creator}
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
                            initValue={currentDept.createDate}
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
                            initValue={currentDept.modifier}
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
                            initValue={currentDept.modifyDate}
                            pickDone={handleGetValue}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddDept}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>{t("back")}</Button>
                }



            </DialogActions>
        </>
        : <Loader />
    );
};

export default EditDept;