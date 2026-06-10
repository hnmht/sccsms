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
import { DateTimeFormat, dayjs, EpochTime } from '../../../i18n/dayjs';
import { Divider } from '../../../component/ScMui/ScMui';
import Loader from '../../../component/Loader/Loader';
import ScInput from '../../../component/ScInput';
import MoreInfo from "../../../component/MoreInfo/MoreInfo";
import { getCurrentPerson, checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { reqAddCS, reqEditCS, reqCheckCSCode } from '../../../api/csa';
import { useTranslation } from 'react-i18next';

// Generate initial Construction Site Archive 
const getInitialValues = async (oriCS, isNew, isModify, CSC) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newCS = {// Add
        id: 0,
        code: "",
        name: "",
        description: "",
        csc: CSC,
        subDept: { id: 0, code: '', name: '' },
        respDept: { id: 0, code: '', name: '' },
        respPerson: { id: 0, code: '', name: '' },
        status: 0,
        endFlag: 0,
        endDate: currentDate,
        longitude: 0,
        latitude: 0,
        udf1: { id: 0, code: '', name: '' },
        udf2: { id: 0, code: '', name: '' },
        udf3: { id: 0, code: '', name: '' },
        udf4: { id: 0, code: '', name: '' },
        udf5: { id: 0, code: '', name: '' },
        udf6: { id: 0, code: '', name: '' },
        udf7: { id: 0, code: '', name: '' },
        udf8: { id: 0, code: '', name: '' },
        udf9: { id: 0, code: '', name: '' },
        udf10: { id: 0, code: '', name: '' },
        creator: person,
        modifier: { id: 0, code: "", name: "" },
        createDate: currentDate,
        modifyDate: EpochTime
    };
    if (isNew) {
        if (oriCS) {// Copy Add
            newCS = {
                ...oriCS,
                id: 0,
                code: "",
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime
            };
        }
    } else {
        if (isModify) {// Edit
            newCS = {
                ...oriCS,
                modifier: person,
                modifyDate: currentDate
            }
        } else {// View
            newCS = {
                ...oriCS,
            }
        }
    }
    return newCS;
};

// Add,Edit,View the Construction Site Archive
const EditCSA = ({ isOpen, isNew, isModify, oriCS, options, CSC, onCancel, onOk }) => {
    const [currentCSA, setCurrentCSA] = useState(undefined);
    const [errors, setErrors] = useState({});
    const isEdit = !(!isModify && !isNew);
    const { t } = useTranslation();
    // Initilize CSC value when the component loads.  
    useEffect(() => {
        async function initValue() {
            const newCS = await getInitialValues(oriCS, isNew, isModify, CSC);
            setCurrentCSA(newCS);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriCS, isNew, isModify, CSC]);

    // Data processing actions after the data is passed into the ScInput components
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (!isOpen || !isEdit || currentCSA === undefined) {
            return
        }
        // Change errors value
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change currentCSA value
        setCurrentCSA((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    };
    // Add or Edit CSA
    const handleAddCS = async () => {
        let thisCS = cloneDeep(currentCSA);
        delete thisCS.createDate;
        delete thisCS.modifyDate;
        if (isModify) {
            let editRes = await reqEditCS(thisCS);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            }
        } else {
            let addRes = await reqAddCS(thisCS);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk();
            }
        }
    };
    // Check if the CSC code exists
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let checkResp = await reqCheckCSCode({ id: currentCSA.id, csc: CSC, code: value }, false);
        if (checkResp.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: checkResp.msg };
        }
        return err;
    };

    return currentCSA
        ? <>
            <DialogTitle>{isNew ? t("addCSA") : isModify ? t("modifyCSA") : t("viewCSA")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 768 }}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={525}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="csc"
                            itemKey="csc"
                            initValue={currentCSA.csc}
                            pickDone={handleGetValue}
                            placeholder=""
                            isBackendTest={false}
                            key="csc"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="code"
                            itemKey="code"
                            initValue={currentCSA.code}
                            pickDone={handleGetValue}
                            placeholder="codePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestCode}
                            key="code"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={301}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="name"
                            itemKey="name"
                            initValue={currentCSA.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={false}
                            key="name"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentCSA.description}
                            pickDone={handleGetValue}
                            placeholder="descriptionPlaceholder"
                            isBackendTest={false}
                            isMultiline={true}
                            rowNumber={2}
                            key="description"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="subDept"
                            itemKey="subDept"
                            initValue={currentCSA.subDept}
                            pickDone={handleGetValue}
                            placeholder="deptPlaceholder"
                            isBackendTest={false}
                            key="subDept"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={520}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="respDept"
                            itemKey="respDept"
                            initValue={currentCSA.respDept}
                            pickDone={handleGetValue}
                            placeholder="deptPlaceholder"
                            isBackendTest={false}
                            key="respDept"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <ScInput
                            dataType={510}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="respPerson"
                            itemKey="respPerson"
                            initValue={currentCSA.respPerson}
                            pickDone={handleGetValue}
                            placeholder="choosePersonPlaceholder"
                            isBackendTest={false}
                            key="respPerson"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={302}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="longitude"
                            itemKey="longitude"
                            initValue={currentCSA.longitude}
                            pickDone={handleGetValue}
                            placeholder="longitudePlaceholder"
                            isBackendTest={false}
                            key="longitude"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ScInput
                            dataType={302}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="latitude"
                            itemKey="latitude"
                            initValue={currentCSA.latitude}
                            pickDone={handleGetValue}
                            placeholder="latitudePlaceholder"
                            isBackendTest={false}
                            key="latitude"
                            positionID={0}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            {options.map((udf) => {
                                if (udf.enable === 1) {
                                    return <Grid item xs={6} key={udf.code}>
                                        <ScInput
                                            dataType={550}
                                            allowNull={true}
                                            isEdit={isEdit}
                                            itemShowName={udf.displayName}
                                            itemKey={udf.code}
                                            initValue={currentCSA[udf.code]}
                                            pickDone={handleGetValue}
                                            placeholder={t("chooseUDAPlaceholder", { udcName: udf.udc.name })}
                                            isBackendTest={false}
                                            key={udf.code}
                                            positionID={0}
                                            udc={udf.udc}
                                        />
                                    </Grid>;
                                }
                                return null;
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                        <ScInput
                            dataType={403}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="end"
                            itemKey="endFlag"
                            initValue={currentCSA.endFlag}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="endFlag"
                            isBackendTest={false}
                            positionID={0}
                        />
                    </Grid>
                    {currentCSA.endFlag === 1
                        ? <Grid item xs={4}>
                            <ScInput
                                dataType={306}
                                allowNull={currentCSA.endFlag === 0}
                                isEdit={isEdit && currentCSA.endFlag === 1}
                                itemShowName="endDate"
                                itemKey="endDate"
                                initValue={currentCSA.endDate}
                                pickDone={handleGetValue}
                                placeholder=""
                                key="endDate"
                                isBackendTest={false}
                                positionID={0}
                            />
                        </Grid>
                        : null
                    }
                    <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                        <ScInput
                            dataType={402}
                            allowNull={false}
                            isEdit={isEdit}
                            itemShowName="disable"
                            itemKey="status"
                            initValue={currentCSA.status}
                            pickDone={handleGetValue}
                            placeholder=""
                            key="status"
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
                            initValue={currentCSA.creator}
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
                            initValue={currentCSA.createDate}
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
                            initValue={currentCSA.modifier}
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
                            initValue={currentCSA.modifyDate}
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
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddCS}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant='contained' onClick={onCancel}>{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditCSA;