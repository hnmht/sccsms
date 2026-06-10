import { useState, useEffect } from "react";
import { Button, ActivityIndicator } from "react-native-paper";
import { Alert, ScrollView, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store/hooks";
import { setUserInfo } from "../../store/slice/user";
import { saveUserInfo } from "../../db/crud/userInfo";
import { UserInfo } from "../../dataType/types/user";
import { useSettingNavigation } from "../../navigation/config/screenParams";
import ScInput from "../../components/ScInput";
import { reqUserInfo, reqModifyProfile } from "../../api/user";
import { getEmptyUser } from "../../dataType/dataZero/user";
import { InitialValueMap, ErrMsg } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { getFieldErrMsg } from "../../dataType/dataZero/errors";
import { checkObjectError } from "../../components/tools/checkError";

// Update user avatar, gender, mobile, email, and description.
const Profile = () => {
    const [currentUser, setCurrentUser] = useState<UserInfo | undefined>(undefined);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState(getFieldErrMsg(getEmptyUser(), { isErr: false, msg: "" }));
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigation = useSettingNavigation();
    const { t } = useTranslation();
    
    useEffect(() => {
        async function initialData() {
            let userRes = await reqUserInfo();
            let user: UserInfo = getEmptyUser();
            if (userRes.status) {
                user = userRes.data;
                dispatch(setUserInfo(user));
            } else {
                Alert.alert(t("error"), userRes.msg);
            }
            setCurrentUser(user);
        }
        initialData();
    }, []);

    const handleGetValue = <T extends keyof InitialValueMap>(value: InitialValueMap[T], itemkey: string, positionID: 0 | 1 | 2, rowIndex: number, errMsg: ErrMsg) => {
        if (currentUser === undefined || !isEdit || errors === undefined) {
            return
        }
        // Update Errors
        setErrors((prevState) => {
            return ({
                ...prevState,
                [itemkey]: errMsg,
            });
        });
        // Update currentUser
        setCurrentUser((prevState: any) => {
            return ({
                ...prevState,
                [itemkey]: value,
            });
        });
    };
    // Actions after press Save button
    const handleModifyUser = async () => {
        if (!currentUser) {
            return
        }
        setIsLoading(true)
        let thisUser = cloneDeep(currentUser);
        const modifyRes = await reqModifyProfile(thisUser);
        if (modifyRes.status) {
            thisUser = modifyRes.data;
            Alert.alert(t("tip"), t("modifySuccessful"));
        } else {
            Alert.alert(t("err"), modifyRes.msg);
        }
        setCurrentUser(thisUser);
        setIsEdit(false);
        setIsLoading(false);
        saveUserInfo(thisUser);
        dispatch(setUserInfo(thisUser));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {currentUser !== undefined
                    ? <ScrollView style={{ flex: 1 }} >
                        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                            <ScInput
                                dataType={ScDataTypeList.AvatarUpload}
                                positionID={0}
                                rowIndex={0}
                                allowNull={true}
                                itemShowName={t("avatar")}
                                errInfo={{ isErr: false, msg: "" }}
                                isEdit={isEdit}
                                itemKey="avatar"
                                width={"100%"}
                                initValue={currentUser.avatar}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                isOnSitePhoto={false}
                                key="avatar"
                                onCancel={() => navigation.goBack()}
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                positionID={0}
                                rowIndex={0}
                                allowNull={false}
                                itemShowName={t("code")}
                                errInfo={{ isErr: false, msg: "" }}
                                isEdit={false}
                                itemKey="code"
                                initValue={currentUser.code}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="code"
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                positionID={0}
                                rowIndex={0}
                                allowNull={false}
                                itemShowName={t("code")}
                                errInfo={{ isErr: false, msg: "" }}
                                isEdit={false}
                                itemKey="code"
                                initValue={currentUser.code}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="code1"
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                positionID={0}
                                rowIndex={0}
                                allowNull={false}
                                itemShowName={t("name")}
                                errInfo={{ isErr: false, msg: "" }}
                                isEdit={false}
                                itemKey="name"
                                initValue={currentUser.name}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="name"
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.SimpDept}
                                positionID={0}
                                rowIndex={0}
                                allowNull={true}
                                isEdit={false}
                                itemShowName={t("subDept")}
                                itemKey="deptName"
                                initValue={currentUser.department}
                                pickDone={handleGetValue}
                                errInfo={{ isErr: false, msg: "" }}
                                placeholder={t("deptPlaceholder")}
                                key="deptName"
                                isBackendTest={false}
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Gender}
                                positionID={0}
                                rowIndex={0}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName={t("gender")}
                                errInfo={errors.gender}
                                itemKey="gender"
                                initValue={currentUser.gender}
                                pickDone={handleGetValue}
                                placeholder=""
                                key="gender"
                                isBackendTest={false}
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                positionID={0}
                                rowIndex={0}
                                allowNull={true}
                                itemShowName={t("mobile")}
                                errInfo={errors.mobile}
                                isEdit={isEdit}
                                itemKey="mobile"
                                initValue={currentUser.mobile}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="mobile"
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Email}
                                positionID={0}
                                rowIndex={0}
                                allowNull={true}
                                itemShowName={t("email")}
                                errInfo={errors.email}
                                isEdit={isEdit}
                                itemKey="email"
                                initValue={currentUser.email}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="email"
                                width="100%"
                            />
                            <ScInput
                                dataType={ScDataTypeList.Text}
                                positionID={0}
                                rowIndex={0}
                                allowNull={true}
                                itemShowName={t("description")}
                                errInfo={errors.description}
                                isEdit={isEdit}
                                itemKey="description"
                                initValue={currentUser.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                textLines={4}
                                key="description"
                                width="100%"
                            />
                        </View>
                    </ScrollView>
                    : <ActivityIndicator />
                }

                {currentUser === undefined
                    ? null
                    : <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8 }}>
                        {isEdit
                            ? <>
                                <Button mode='text' loading={isLoading} onPress={() => setIsEdit(false)} maxFontSizeMultiplier={1}>{t("cancel")}</Button>
                                <Button mode='contained' loading={isLoading} disabled={checkObjectError(errors) || isLoading} onPress={handleModifyUser} maxFontSizeMultiplier={1}>{t("save")}</Button>
                            </>
                            : <>
                                <Button mode="text" onPress={() => navigation.goBack()} style={{ marginHorizontal: 4 }} maxFontSizeMultiplier={1} >{t("back")}</Button>
                                <Button mode="contained" onPress={() => setIsEdit(true)} style={{ marginHorizontal: 4 }} maxFontSizeMultiplier={1}>{t("edit")}</Button>
                            </>
                        }
                    </View>
                }
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Profile;
