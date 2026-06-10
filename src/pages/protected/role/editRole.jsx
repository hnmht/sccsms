import { useState, useEffect, useCallback } from "react";
import {
    Grid,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { message } from "mui-message";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";

import { EpochTime } from "../../../i18n/dayjs";
import { Divider } from "../../../component/ScMui/ScMui";
import ScInput from "../../../component/ScInput";
import { reqValidateRoleName, reqEditRole, reqAddRole } from "../../../api/role";
import { getCurrentPerson } from "../pub/pubFunction";
import Loader from "../../../component/Loader/Loader";
import MoreInfo from "../../../component/MoreInfo/MoreInfo";
import { checkVoucherNoBodyErrors } from '../pub/pubFunction';

// General initialization data.
const getInitialValue = async (oriRole, isNew, isModify) => {
    const person = await getCurrentPerson();
    const currentDate = new Date();
    let newRole = {};
    if (isNew) {
        if (oriRole) {  // Copy Add New
            newRole = cloneDeep(oriRole);
            newRole.id = 0;
            newRole.name = "";
            newRole.creator = person;
            newRole.modifier = { id: 0, code: "", name: "" };
            newRole.createDate = currentDate;
            newRole.modifyDate = EpochTime;
            newRole.member = newRole.member === null ? [] : newRole.member;
        } else { // Add New
            newRole = {
                id: 0,
                name: "",
                description: "",
                dr: 0,
                creator: person,
                modifier: { id: 0, code: "", name: "" },
                createDate: currentDate,
                modifyDate: EpochTime,
                alluserflag: 0,
                systemflag: 0,
                member: [],
            };
        }
    } else { // Modify or View
        if (!oriRole) {
            return
        } else {
            if (isModify) {
                newRole = cloneDeep(oriRole);
                newRole.member = newRole.member ? newRole.member : [];
                newRole.modifier = person;
                newRole.modifyDate = currentDate;
            } else { // View
                newRole = cloneDeep(oriRole);
                newRole.member = newRole.member ? newRole.member : [];
            }
        }
    }
    return newRole;
};

// Add/Modify/View Role Master Data
const EditRole = ({ isOpen, isNew, isModify, oriRole, onCancel, onOk }) => {
    const [currentRole, setCurrentRole] = useState(undefined);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

    const isEdit = !(!isModify && !isNew);

    useEffect(() => {
        async function initValue() {
            const initRole = await getInitialValue(oriRole, isNew, isModify);
            setCurrentRole(initRole);
        }
        if (isOpen) {
            initValue();
        }
    }, [isOpen, oriRole, isNew, isModify]);

    // Actions after receiving the return value from the child component. 
    const handleGetValue = useCallback((value, itemkey, fieldIndex, rowIndex, errMsg) => {
        if (currentRole === undefined || !isOpen || !isEdit) {
            return
        }
        // Update errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });

        // Update commponent's value
        setCurrentRole((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            })
        })
    }, [isOpen, isEdit, currentRole]);

    // Add or Modify Role
    const handleAddRole = async () => {
        let thisRole = cloneDeep(currentRole);
        delete thisRole.createDate;
        delete thisRole.modifyDate;
        if (isModify) {
            const editRes = await reqEditRole(thisRole);
            if (editRes.status) {
                message.success(t("modifySuccessful"));
                onOk();
            } 
        } else {
            const addRes = await reqAddRole(thisRole);
            if (addRes.status) {
                message.success(t("addSuccessful"));
                onOk()
            } 
        }
    };
    // Request the backend server to validate if the name is a duplicate.
    const handleBackendTestName = async (value) => {
        let err = { isErr: false, msg: "" };
        let res = await reqValidateRoleName({ id: currentRole.id, name: value });
        if (res.status) {
            err = { isErr: false, msg: "" };
        } else {
            err = { isErr: true, msg: res.msg };
        }
        return err;
    };

    return (currentRole
        ? <>
            <DialogTitle>{isNew ? t("addRole") : isModify ? t("modifyRole") : t("viewRole")}</DialogTitle>
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
                            initValue={currentRole.name}
                            pickDone={handleGetValue}
                            placeholder="namePlaceholder"
                            isBackendTest={true}
                            backendTestFunc={handleBackendTestName}
                            positionID={0}
                            key="name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={301}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="description"
                            itemKey="description"
                            initValue={currentRole.description}
                            pickDone={handleGetValue}
                            placeholder="descriptionPlaceholder"
                            isMultiline={true}
                            rowNumber={2}
                            isBackendTest={false}
                            positionID={0}
                            key="description"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ScInput
                            dataType={502}
                            allowNull={true}
                            isEdit={isEdit}
                            itemShowName="member"
                            itemKey="member"
                            initValue={currentRole.member}
                            pickDone={handleGetValue}
                            placeholder="memberPlaceholder"
                            isBackendTest={false}
                            key="member"
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
                            initValue={currentRole.creator}
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
                            initValue={currentRole.createDate}
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
                            initValue={currentRole.modifier}
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
                            initValue={currentRole.modifyDate}
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
                        <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                        <Button variant="contained" disabled={checkVoucherNoBodyErrors(errors)} onClick={handleAddRole}>{isModify ? t("save") : t("add")}</Button>
                    </>
                    : <Button variant="contained" onClick={onCancel} >{t("back")}</Button>
                }
            </DialogActions>
        </>
        : <Loader />
    );
};

export default EditRole;