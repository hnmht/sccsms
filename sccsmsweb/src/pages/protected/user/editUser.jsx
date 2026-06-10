import React, { useState, useCallback, useEffect } from 'react';
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
import { dayjs,EpochTime } from "../../../i18n/dayjs";

import { Divider } from '../../../component/ScMui/ScMui';
import ScInput from '../../../component/ScInput';
import Loader from '../../../component/Loader/Loader';
import MoreInfo from '../../../component/MoreInfo/MoreInfo';
import { getCurrentPerson } from '../pub/pubFunction';
import { reqValidateUserCode, reqAddUser, reqEditUser } from '../../../api/user';
import { reqGetPublicKey } from '../../../api/security';
import { InitDocCache } from '../../../storage/db/db';
import { checkVoucherNoBodyErrors } from '../pub/pubFunction';
import { encryptPassword } from '../../../utils/encrypt';

const initRoles = [{
    id: 10001, name: "public", alluserflag: 1, systemflag: 1, description: "System default"
}];

// General initialization data
const getInitialValues = async (oriUser, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = dayjs(new Date());
    let newUser = {};
    if (isNew) { //Add New or Copy Add new
        if (oriUser) { // Copy Add New
            newUser = cloneDeep(oriUser);
            newUser.id = 0;
            delete newUser.menuList;
            newUser.avatar = { fileid: 0, tempurl: "" };
            newUser.code = "";
            newUser.name = "";
            newUser.password = "";
            newUser.confirmPassword = "";
            newUser.creator = person;
            newUser.createDate = currentDate;
            newUser.modifyDate = EpochTime;
        } else { // Add New
            newUser = {
                id: 0,
                avatar: { fileid: 0, tempurl: "" },
                code: "",
                description: "",
                email: "",
                gender: 0,
                mobile: "",
                name: "",
                systemFlag: 0,
                status: 0,
                locked: 0,
                password: "",
                isOperator: 1,
                position: { id: 0, name: "", description: "" },
                department: { id: 0, code: '', name: '' },
                confirmPassword: "",
                roles: initRoles,
                creator: person,
                createDate: currentDate,
                modifyDate: EpochTime,
            };
        }
    } else { // Modify or View
        if (!oriUser) {
            return
        } else { // Edit
            if (isModify) {
                newUser = cloneDeep(oriUser);
                newUser.modifier = person;
                newUser.modifyDate = currentDate;
                newUser.password = "";
                newUser.confirmPassword = "";
            } else {// View Detail
                newUser = cloneDeep(oriUser);
                newUser.password = ""
                newUser.confirmPassword = ""
            }
        }
    }
    return newUser;
};

// Add or Edit or View User Component
const EditUser = ({ isOpen, isNew, isModify, oriUser, onCancel, onOk }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();
    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const newUser = await getInitialValues(oriUser, isNew, isModify);
            setCurrentUser(newUser);
        }
        if (isOpen) {
            initValue();
        }

    }, [isOpen, oriUser, isNew, isModify]);
    // Data processing actions after data is passed into the ScInput components 
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentUser === undefined || !isOpen || !isEdit) {
            return
        }
        // Referesh errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Update fields
        setCurrentUser((prevState) => {
            let newValue = cloneDeep(prevState);
            newValue[itemkey] = value;
            return newValue;
        });
    }, [currentUser, isOpen, isEdit]);

    // Check if the passwords match.
    const handleTestConfirmPassword = (value) => {
        let err = { isErr: false, msg: "" };
        if (value !== currentUser.password) {
            err = { isErr: true, msg: "passwordsMustMatch" };
        }
        return err;
    };
    // Check if the user code exists.
    const handleBackendTestCode = async (value) => {
        let err = { isErr: false, msg: "" };
        let uid = currentUser.id ? currentUser.id : 0;
        let res = await reqValidateUserCode({ id: uid, "code": value });
        if (res.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: res.msg };
        }
        return err;
    };

    // Add or Edit user
    const handleAddUser = async () => {
        let thisUser = cloneDeep(currentUser);
        delete thisUser.createDate;
        delete thisUser.modifyDate;
        // If the password field is not empty,
        // it means the user needs to change their password.
        if (thisUser.password !== "") {
            // Get RSA Public key from the server
            const publicKeyRes = await reqGetPublicKey();
            if (!publicKeyRes.status) {
                return
            }
            const publickey = publicKeyRes.data;
            // Encrypt
            let rsaPassword = encryptPassword(publickey, thisUser.password);
            // Replace the content of the password filed with ciphertext
            thisUser.password = rsaPassword;
        }
        // Delete the content of the confirmPassword filed.
        delete thisUser.confirmPassword;

        if (isModify) { // Edit user
            const resEdit = await reqEditUser(thisUser);
            if (resEdit.status) {
                message.success(t("modifySuccessful"));
                onOk();
            } else {
                message.error(t("modifyFailed") + resEdit.msg);
            }
        } else { // Add user
            const resAdd = await reqAddUser(thisUser);
            if (resAdd.status) {
                message.success(t("addSuccessful"));
                onOk();
            } else {
                message.error(t("addFailed") + resAdd.msg);
            }
        }
        // Get latest person master data for front-end cache
        await InitDocCache("person");
    }

    return currentUser
        ? <>
            <DialogTitle>{isNew ? t("addUser") : isModify ? t("modifyUser") : t("viewUser")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2, maxHeight: 800 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <ScInput
                            dataType={901}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="avatar"
                            itemKey="avatar"
                            initValue={currentUser.avatar}
                            pickDone={handleGetValue}
                            placeholder="selectAvatarPlaceholder"
                            isBackendTest={false}
                            key="avatar"
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={false}
                                    isEdit={isEdit}
                                    itemShowName="code"
                                    itemKey="code"
                                    initValue={currentUser.code}
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
                                    initValue={currentUser.name}
                                    pickDone={handleGetValue}
                                    placeholder="namePlaceholder"
                                    isBackendTest={false}
                                    key="name"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={303}
                                    allowNull={isModify}
                                    isEdit={isEdit}
                                    itemShowName="labelPassword"
                                    itemKey="password"
                                    initValue={currentUser.password}
                                    pickDone={handleGetValue}
                                    placeholder="inputPasswordPlaceholder"
                                    isBackendTest={false}
                                    key="password"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={303}
                                    allowNull={isModify}
                                    isEdit={isEdit}
                                    itemShowName="confirmPassword"
                                    itemKey="confirmPassword"
                                    initValue={currentUser.confirmPassword}
                                    pickDone={handleGetValue}
                                    placeholder="confirmPasswordPlaceholder"
                                    key="confirmPassword"
                                    isBackendTest={true}
                                    backendTestFunc={(value) => handleTestConfirmPassword(value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={301}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="mobile"
                                    itemKey="mobile"
                                    initValue={currentUser.mobile}
                                    pickDone={handleGetValue}
                                    placeholder="mobilePlaceholder"
                                    key="mobile"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={305}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="email"
                                    itemKey="email"
                                    initValue={currentUser.email}
                                    pickDone={handleGetValue}
                                    placeholder="emailPlaceholder"
                                    key="email"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={401}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="gender"
                                    itemKey="gender"
                                    initValue={currentUser.gender}
                                    pickDone={handleGetValue}
                                    placeholder="choose"
                                    key="gender"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={520}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="department"
                                    itemKey="department"
                                    initValue={currentUser.department}
                                    pickDone={handleGetValue}
                                    placeholder="deptPlaceholder"
                                    key="department"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <ScInput
                                    dataType={610}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="position"
                                    itemKey="position"
                                    initValue={currentUser.position}
                                    pickDone={handleGetValue}
                                    placeholder="positionPlaceholder"
                                    key="position"
                                    isBackendTest={false}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <ScInput
                                    dataType={301}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="description"
                                    itemKey="description"
                                    initValue={currentUser.description}
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
                                    dataType={501}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="role"
                                    itemKey="roles"
                                    initValue={currentUser.roles}
                                    pickDone={handleGetValue}
                                    placeholder="rolePlaceholder"
                                    key="roles"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                <ScInput
                                    dataType={402}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="isOperator"
                                    itemKey="isOperator"
                                    initValue={currentUser.isOperator}
                                    pickDone={handleGetValue}
                                    placeholder="isOperator"
                                    key="isOperator"
                                    isBackendTest={false}
                                    color="success"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                <ScInput
                                    dataType={402}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="locked"
                                    itemKey="locked"
                                    initValue={currentUser.locked}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    key="locked"
                                    isBackendTest={false}
                                    color="warning"
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
                                <ScInput
                                    dataType={402}
                                    allowNull={true}
                                    isEdit={isEdit}
                                    itemShowName="disable"
                                    itemKey="status"
                                    initValue={currentUser.status}
                                    pickDone={handleGetValue}
                                    placeholder=""
                                    key="status"
                                    isBackendTest={false}
                                    color="warning"
                                />
                            </Grid>
                        </Grid>
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
                            initValue={currentUser.creator}
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
                            initValue={currentUser.createDate}
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
                            initValue={currentUser.modifier}
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
                            initValue={currentUser.modifyDate}
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
                        <Button color='error' variant='contained' onClick={onCancel}>{t("cancel")}</Button>
                        <Button variant='contained' disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddUser}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
};

export default EditUser;