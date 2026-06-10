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
import { EpochTime } from '../../../i18n/dayjs';
import { cloneDeep } from 'lodash';
import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { reqAddUDA, reqCheckUDACode, reqEditUDA } from '../../../api/uda';

// Generate initial values for the UDA master data
const getInitialValues = async (oriUDA, isNew, isModify, currentUDC) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newUda = { // Add brand new
        id: 0,
        udc: currentUDC,
        code: "",
        name: "",
        description: "",
        fatherID: 0,
        status: 0,
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime,
    };
    if (isNew) { // Copy add or Edit or View
        if (oriUDA) {// Copy Add
            newUda = cloneDeep(oriUDA);
            newUda.id = 0;
            newUda.code = "";
            newUda.creator = person;
            newUda.modifier = { id: 0, code: "", name: "" };
            newUda.createDate = currentDate;
            newUda.modifyDate = EpochTime;
        }
    } else { // Edit or View
        if (!oriUDA) { // Error
            return
        } else {
            if (isModify) { // Edit
                newUda = cloneDeep(oriUDA);
                newUda.modifier = person;
                newUda.modifyDate = currentDate;
            } else {// View
                newUda = cloneDeep(oriUDA);
            }
        }
    }
    return newUda;
};
// Add, Edit, View User-defined Archive
const EditUDA = ({ isOpen, isNew, isModify, oriUDA, UDC, onCancel, onOk }) => {
    const [currentUDA, setCurrentUDA] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const initUdd = await getInitialValues(oriUDA, isNew, isModify, UDC)
            setCurrentUDA(initUdd);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriUDA, isNew, isModify, UDC]);

    // Data processing actions after the data is passed into the ScInput components
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentUDA === undefined || !isOpen || !isEdit) {
            return
        }
        // Change errors value
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentUDA value
        setCurrentUDA((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    }, [isOpen, currentUDA, isEdit]);

    // Add or Edit UDA master data
    const handleAddUDA = async () => {
        let thisUDA = cloneDeep(currentUDA);
        delete thisUDA.createDate;
        delete thisUDA.modifyDate;
        if (isModify) {
            let editRes = await reqEditUDA(thisUDA);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddUDA(thisUDA);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };
    // Check if the UDA code exists
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let docId = currentUDA.id ? currentUDA.id : 0;
        let checkResp = await reqCheckUDACode({ id: docId, udc: UDC, code: value }, false);

        if (checkResp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.msg };
        }
        return err;
    }

    return currentUDA
        ? <>
            <DialogTitle>{isNew ? t("addUDA") : isModify ? t("modifyUDA") : t("viewUDA")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="code"
                            itemKey="code"
                            initValue={currentUDA.code}
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
                            initValue={currentUDA.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
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
                            initValue={currentUDA.description}
                            pickDone={handleGetValue}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="MenuUDC"
                            itemKey="udc.name"
                            initValue={currentUDA.udc.name}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            key="udc.name"
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={currentUDA.status}
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
                            initValue={currentUDA.creator}
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
                            initValue={currentUDA.createDate}
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
                            initValue={currentUDA.modifier}
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
                            initValue={currentUDA.modifyDate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddUDA}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditUDA;