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
import { useTranslation } from 'react-i18next';
import { EpochTime } from '../../../i18n/dayjs';

import { Divider } from '../../../component/ScMui/ScMui';
import Loader from '../../../component/Loader/Loader';
import ScInput from '../../../component/ScInput';
import MoreInfo from "../../../component/MoreInfo/MoreInfo";

import { reqCheckPositionName, reqAddPosition, reqEditPosition } from '../../../api/position';
import { InitDocCache } from '../../../storage/db/db';
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';

// Generate initial position values
const getInitialValues = async (diagStatus) => {
    const { isNew, isModify, oriPosition } = diagStatus;
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newPosition = {};
    if (isNew) {
        if (oriPosition) {// CopyAdd
            newPosition = cloneDeep(oriPosition);
            newPosition.id = 0;
            newPosition.name = "";
            newPosition.creator = person;
            newPosition.modifier = { id: 0, code: "", name: "" };
            newPosition.createDate = currentDate;
            newPosition.modifyDate = EpochTime;
        } else {
            newPosition = { // Add 
                id: 0,
                name: "",
                description: "",
                status: 0,
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (!oriPosition) { // error
            return
        } else {
            if (isModify) {// Edit
                newPosition = cloneDeep(oriPosition);
                newPosition.modifier = person;
                newPosition.modifyDate = currentDate;
            } else { // Detail
                newPosition = cloneDeep(oriPosition);
            }
        }
    }
    return newPosition;
};

// Add, modify, delete, and view position master data.
const EditPosition = ({ diagStatus, onCancel, onOk }) => {
    const { isOpen, isNew, isModify } = diagStatus;
    const [currentPosition, setCurrentPosition] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();

    useEffect(() => {
        async function initValue() {
            const initOP = await getInitialValues(diagStatus);
            setCurrentPosition(initOP);
        }
        if (diagStatus.isOpen) {
            initValue();
        }
    }, [diagStatus]);

    // Data processing actions after the data is passed into the ScInput components
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentPosition === undefined) {
            return
        }
        // Change errors values
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentPosition values
        setCurrentPosition((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };

    // Add or Modify the Postion master data.
    const handleAddPosition = async () => {
        let thisOP = cloneDeep(currentPosition);
        delete thisOP.createDate;
        delete thisOP.modifyDate;
        if (isModify) {
            // Request the server to  modify the positon master data 
            const editRes = await reqEditPosition(thisOP);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            // Request the server to add the position master data
            const addRes = await reqAddPosition(thisOP);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
        // Get the latest position front-end cache
        await InitDocCache("position");
    }
    // Check if the position name exists
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let opId = currentPosition.id ? currentPosition.id : 0;
        let resp = await reqCheckPositionName({ id: opId, "name": value }, false);
        if (resp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: resp.msg };
        }
        return err;
    };

    return currentPosition
        ? <>
            <DialogTitle>{isNew ? t("addPosition") : isModify ? t("modifyPosition") : t("viewPosition")}</DialogTitle>
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
                            initValue={currentPosition.name}
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
                            initValue={currentPosition.description}
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
                            initValue={currentPosition.status}
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
                            initValue={currentPosition.creator}
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
                            initValue={currentPosition.createDate}
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
                            initValue={currentPosition.modifier}
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
                            initValue={currentPosition.modifyDate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddPosition}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />

};

export default EditPosition;