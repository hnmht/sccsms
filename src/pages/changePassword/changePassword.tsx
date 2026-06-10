import { useState, useMemo } from "react";
import { Text, Button } from "react-native-paper";
import { Alert, ScrollView, View } from "react-native";
import { useAppSelector } from "../../store/hooks";
import jsencrypt from "jsencrypt";
import { cloneDeep } from "lodash";
import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import { reqGetPublicKey } from "../../api/security";
import { reqChangePwd } from "../../api/login";
import { checkObjectError } from "../../components/tools/checkError";
import { ParamChangePwd } from "../../dataType/types/login";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { useSettingNavigation } from "../../navigation/config/screenParams";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const validateData = (params: ParamChangePwd) => {
    const noErr: ErrMsg = { isErr: false, msg: "" };
    let errData = {
        password: noErr,
        newPassword: noErr,
        confirmNewPassword: noErr
    };

    if (params.password === "") {
        errData.password = { isErr: true, msg: "cannotEmpty" }
    }
    if (params.newPassword === "") {
        errData.newPassword = { isErr: true, msg: "cannotEmpty" }
    }

    if (params.confirmNewPassword === "") {
        errData.confirmNewPassword = { isErr: true, msg: "cannotEmpty" }
    } else {
        if (params.newPassword !== params.confirmNewPassword) {
            errData.confirmNewPassword = { isErr: true, msg: "passwordsMustMatch" }
        }
    }
    return errData;
};
// Change Password page
const ChangePassword = () => {
    const user = useAppSelector(state => state.user);
    const [params, setParams] = useState<ParamChangePwd>({
        id: user.id,
        code: user.code,
        name: user.name,
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useSettingNavigation();
    const { t } = useTranslation();
    const dataErrs = useMemo(() => validateData(params), [params]);

    // Actions after  ScInput Components Input value
    const handleGetValue = <T extends keyof InitialValueMap>(value: InitialValueMap[T], itemkey: string, positionID: 0 | 1 | 2, rowIndex: number, errMsg: ErrMsg) => {
        setParams((prevState) => {
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };

    // Change password
    const handleChangePassword = async () => {
        setIsLoading(true);
        // Request public key from backend
        const resPubKey = await reqGetPublicKey(false);
        if (!resPubKey.status) {
            setIsLoading(false);
            return
        }
        const publicKey = resPubKey.data;
        let thisParams = cloneDeep(params);
        let encryptor = new jsencrypt();
        encryptor.setPublicKey(publicKey);

        const encPassword = encryptor.encrypt(thisParams.password);
        if (!encPassword) {
            Alert.alert(t("error"), t("encryptionFailed"));
            setIsLoading(false);
            return;
        }
        thisParams.password = encPassword;

        const encNewPassword = encryptor.encrypt(thisParams.newPassword);
        if (!encNewPassword) {
            Alert.alert(t("error"), t("encryptionFailed"));
            setIsLoading(false);
            return;
        }
        thisParams.newPassword = encNewPassword;

        const encConfirmPassword = encryptor.encrypt(thisParams.confirmNewPassword);
        if (!encConfirmPassword) {
            Alert.alert(t("error"), t("encryptionFailed"));
            setIsLoading(false);
            return;
        }
        thisParams.confirmNewPassword = encConfirmPassword;

        const resChangePwd = await reqChangePwd(thisParams);

        if (!resChangePwd.status) {
            setIsLoading(false);
            return
        }
        Alert.alert(t("tip"), t("modifySuccessful"));
        setIsLoading(false);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
                <PersonAvatar url={user.person.avatar.fileUrl} name={user.person.name} />
            </View>
            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1}>{user.name}</Text>
                <Text variant="titleMedium" maxFontSizeMultiplier={1}>({t("code")} : {user.code})</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginVertical: 8 }}>
                    <ScInput
                        dataType={ScDataTypeList.Password}
                        positionID={0}
                        rowIndex={0}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="originalPassword"
                        itemKey="password"
                        errInfo={dataErrs.password}
                        initValue={params.password}
                        pickDone={handleGetValue}
                        placeholder="originalPasswordPlaceholder"
                        isBackendTest={false}
                        key="password"
                    />
                    <ScInput
                        dataType={ScDataTypeList.Password}
                        positionID={0}
                        rowIndex={0}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="newPassword"
                        itemKey="newPassword"
                        initValue={params.newPassword}
                        errInfo={dataErrs.newPassword}
                        pickDone={handleGetValue}
                        placeholder="newPasswordPlaceholder"
                        isBackendTest={false}
                        key="newPassword"
                    />
                    <ScInput
                        dataType={ScDataTypeList.Password}
                        positionID={0}
                        rowIndex={0}
                        allowNull={false}
                        isEdit={true}
                        itemShowName="confirmNewPassword"
                        itemKey="confirmNewPassword"
                        initValue={params.confirmNewPassword}
                        errInfo={dataErrs.confirmNewPassword}
                        pickDone={handleGetValue}
                        placeholder="confirmNewPasswordPlaceholder"
                        key="confirmNewPassword"
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 8 }}>
                    <Button mode='text' loading={isLoading} onPress={() => navigation.goBack()} style={{ marginHorizontal: 4 }}>{t("cancel")}</Button>
                    <Button mode='contained' loading={isLoading} disabled={checkObjectError(dataErrs) || isLoading} onPress={handleChangePassword} style={{ marginHorizontal: 4 }}>{t("ok")}</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;