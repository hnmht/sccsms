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

import { reqAddRL, reqEditRL, reqCheckRLName } from '../../../api/riskLevel';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';

// Generate initial Risk Level 
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriRL } = diagStatus;
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newRL = {};
    if (isNew) {
        if (oriRL) {// Copy and Add
            newRL = cloneDeep(oriRL);
            newRL.id = 0;
            newRL.name = "";
            newRL.color = "blue"
            newRL.creator = person;
            newRL.modifier = { id: 0, code: "", name: "" };
            newRL.createDate = currentDate;
            newRL.modifyDate = EpochTime;
        } else {
            newRL = { //Add
                id: 0,
                name: "",
                description: "",
                color: "blue",
                status: 0,
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (!oriRL) { // Error
            return
        } else {
            if (isModify) {// Modify
                newRL = cloneDeep(oriRL);
                newRL.modifier = person;
                newRL.modifyDate = currentDate;
            } else { // View
                newRL = cloneDeep(oriRL);
            }
        }
    }
    return newRL;
};

// Add, Edit, View Risk Level
const EditRL = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentRl, setCurrentRl] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const initRl = await getInitialValues(diagStatus);
            setCurrentRl(initRl);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    // Data processing actions after the data is passed into the ScInput Components
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentRl === undefined) {
            return
        }
        // Change errors values
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentRL values
        setCurrentRl((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    // Actions after click Add or Edit button 
    const handleAddRL = async () => {
        let thisRL = cloneDeep(currentRl);
        delete thisRL.createDate;
        delete thisRL.modifyDate;
        if (isModify) { // Modify Risk Level
            const editRes = await reqEditRL(thisRL);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else { // Add Risk Level
            const addRes = await reqAddRL(thisRL);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
        // Refresh front-end cache
        await InitDocCache("risklevel");
    }
    // Check if the Risk Level name exists
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let classId = currentRl.id ? currentRl.id : 0;
        let resp = await reqCheckRLName({ id: classId, "name": value }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    return currentRl
        ? <>
            <DialogTitle>{t(isNew ? "addRL" : isModify ? "modifyRL" : "viewRL")}</DialogTitle>
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
                            initValue={currentRl.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={406}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="color"
                            itemKey="color"
                            initValue={currentRl.color}
                            pickDone={handleGetValue}
                            placeholder="chooseRL"
                            isBackendTest={false}
                            key="false"
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentRl.description}
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
                            initValue={currentRl.status}
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
                            initValue={currentRl.creator}
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
                            initValue={currentRl.createDate}
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
                            initValue={currentRl.modifier}
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
                            initValue={currentRl.modifyDate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddRL}>{t(isModify ? "save" : "add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />

};

export default EditRL;