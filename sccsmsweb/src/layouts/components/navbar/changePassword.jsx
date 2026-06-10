import { useState } from "react";
import {
    Stack,
    Avatar,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material";
import { message } from "mui-message";
import { useTranslation } from "react-i18next";
import { encryptPassword } from "../../../utils/encrypt";
import { cloneDeep } from "lodash";
import { Divider } from "../../../component/ScMui/ScMui";
import ScInput from "../../../component/ScInput";
import { reqGetPublicKey } from "../../../api/security";
import { reqChangePwd } from "../../../api/login";

const checkError = (errors) => {
    let number = 0;
    for (let key in errors) {
        if (errors[key].isErr) {
            number = number + 1;
        }
    }
    return number > 0;
};

// Change Password Component
const ChangePassword = ({ user, onCancel }) => {
    const [params, setParams] = useState({
        id: user.id,
        code: user.code,
        name: user.name,
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

    const handleChangePassword = async () => {
        const resPubKey = await reqGetPublicKey(false);
        let publicKey = "";
        if (resPubKey.status) {
            publicKey = resPubKey.data;
        } else {
            return
        }

        let thisParams = cloneDeep(params);
        thisParams.password = encryptPassword(publicKey, thisParams.password);
        thisParams.newPassword = encryptPassword(publicKey, thisParams.newPassword);
        thisParams.confirmNewPassword = encryptPassword(publicKey, thisParams.confirmNewPassword);

        const res = await reqChangePwd(thisParams);
        if (res.status) {
            message.success(t("changePasswordSuccessful"));
            onCancel();
        } else {
            return
        }

    };
    // Data processing after getting value from ScInput 
    const handleGetValue = (value, itemkey, fieldIndex, rowIndex, errMsg) => {
        // Change the error message state
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Change the parameter state
        setParams((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };
    // Confirm new password validation
    const handleTestConfirmPassword = (value) => {
        let err = { isErr: false, msg: "" };
        if (value !== params.newPassword) {
            err = { isErr: true, msg: "passwordsMustMatch" };
        }
        return err;
    };

    return (
        <>
            <DialogTitle>{t("changePassword")}</DialogTitle>
            <Divider />
            <DialogContent sx={{ maxHeight: 512 }}>
                <Stack spacing={2.5} alignItems="center">
                    <Avatar alt="avatar" src={user.avatar.fileUrl} sx={{ mt: 4, width: 60, height: 60 }} />
                    <Typography variant="h5">{user.name}</Typography>
                    <ScInput
                        dataType={303}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="originalPassword"
                        itemKey="password"
                        initValue={params.password}
                        pickDone={handleGetValue}
                        placeholder="originalPasswordPlaceholder"
                        isBackendTest={false}
                        key="password"
                    />
                    <ScInput
                        dataType={303}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="newPassword"
                        itemKey="newPassword"
                        initValue={params.newPassword}
                        pickDone={handleGetValue}
                        placeholder="newPasswordPlaceholder"
                        isBackendTest={false}
                        key="newPassword"
                    />
                    <ScInput
                        dataType={303}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="confirmNewPassword"
                        itemKey="confirmNewPassword"
                        initValue={params.confirmNewPassword}
                        pickDone={handleGetValue}
                        placeholder="confirmNewPasswordPlaceholder"
                        key="confirmNewPassword"
                        isBackendTest={true}
                        backendTestFunc={(value) => handleTestConfirmPassword(value)}
                    />
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
                <Button color='error' onClick={onCancel}>{t("cancel")}</Button>
                <Button variant='contained' disabled={checkError(errors)} onClick={handleChangePassword}>{t("edit")}</Button>
            </DialogActions>
        </>
    );
};

export default ChangePassword;