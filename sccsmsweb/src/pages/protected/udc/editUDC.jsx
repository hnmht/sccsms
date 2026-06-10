import { useState, useEffect } from 'react';
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
import Loader from '../../../component/Loader/Loader';
import ScInput from '../../../component/ScInput';
import MoreInfo from "../../../component/MoreInfo/MoreInfo";

import { reqAddUDC, reqEditUDC, reqCheckUDCName } from '../../../api/udc';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { useTranslation } from 'react-i18next';

// General initial values for the UDC master data.
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriUDC } = diagStatus;
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newUDC = {};
    if (isNew) {
        if (oriUDC) {// Copy add
            newUDC = cloneDeep(oriUDC);
            newUDC.id = 0;
            newUDC.name = "";
            newUDC.creator = person;
            newUDC.modifier = { id: 0, code: "", name: "" };
            newUDC.createDate = currentDate;
            newUDC.modifyDate = EpochTime;
        } else {
            newUDC = { // Add
                id: 0,
                name: "",
                description: "",
                islevel: 0,
                status: 0,
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate:currentDate,
                modifyDate:EpochTime
            };
        }
    } else {
        if (!oriUDC) { // error
            return
        } else {
            if (isModify) {// Modify
                newUDC = cloneDeep(oriUDC);
                newUDC.modifier = person;
                newUDC.modifyDate = currentDate;
            } else { // View
                newUDC = cloneDeep(oriUDC);
            }
        }
    }

    return newUDC;
};

// Add, Edit, View the User-defined Category master data
const EditUDC = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentClass, setCurrentClass] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const initUdc = await getInitialValues(diagStatus);
            setCurrentClass(initUdc);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    // Data processing actions after the data is passed into the ScInput components.
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentClass === undefined) {
            return
        }
        // Modify errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Modify currentClass
        setCurrentClass((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    // Add or Edit UDC
    const handleAddUDC = async () => {
        let thisUDC = cloneDeep(currentClass);
        delete thisUDC.createDate;
        delete thisUDC.modifyDate;
        if (isModify) {
            // Modify UDC
            const editRes = await reqEditUDC(thisUDC);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            // Add UDC
            const addRes = await reqAddUDC(thisUDC);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            } 
        }
        // Refresh the front-end cache
        await InitDocCache("udc");
    }
    // Check if the UDC name exists.
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let classId = currentClass.id ? currentClass.id : 0;
        let resp = await reqCheckUDCName({ id: classId, "name": value }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    return currentClass
        ? <>
            <DialogTitle>{isNew ? t("addCategory") : isModify ? t("modifyCategory") : t("viewCategory")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentClass.name}
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
                            initValue={currentClass.description}
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
                            initValue={currentClass.status}
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
                            initValue={currentClass.creator}
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
                            initValue={currentClass.createDate}
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
                            initValue={currentClass.modifier}
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
                            initValue={currentClass.modifyDate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddUDC}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />

};

export default EditUDC;