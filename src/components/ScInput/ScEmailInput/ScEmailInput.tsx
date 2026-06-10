import { useState, memo, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { useAppSelector } from "../../../store/hooks";
import ScEmailDetail from "./emailDetail";
import { mailRegex } from "../../../utils/regex";

const zeroValue = "";
//305 SeaCloud Email Input Component
const ScEmailInput = (props: ScInputProps<ScDataTypeList.Email>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = false,
        isEdit = true,
        itemShowName = "",
        itemKey,
        initValue = zeroValue,
        isBackendTest = false,
        backendTest,
        pickDone,
        placeholder="",
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const theme = useTheme();
    const { t } = useTranslation();
    const [textValue, setTextValue] = useState(initValue);
    const [detailOpen, setDetailOpen] = useState(false);
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
   
    //Button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition)

    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (textValue.trim() === "" && !allowNull) {
            err = { isErr: true, msg: t("cannotEmpty") };
        } else if (textValue.trim() !== "") {
            let isMoblie = mailRegex.test(textValue);
            err = isMoblie ? { isErr: false, msg: "" } : { isErr: true, msg: t("emailIncorrect") };
        } else if (isBackendTest && backendTest) {
            err = await backendTest(textValue);
        }
        pickDone(textValue, itemKey, positionID, rowIndex, err);
    };

    const handleOnChangeText = (text: string) => {
        setTextValue(text);
    }

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                mode="outlined"
                keyboardType="email-address"
                label={label}
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                placeholder={isEdit ? t(placeholder) : ""}
                onChangeText={(text) => handleOnChangeText(text)}
                value={textValue}
                error={errInfo.isErr}
                left={buttonPosition === "right"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
                        />
                        : null
                    : isEdit && textValue !== ""
                        ? <TextInput.Icon icon="check" onPress={handleOnBlur} />
                        : textValue !== ""
                            ? <TextInput.Icon icon="dots-horizontal" color={theme.colors.secondary} onPress={() => setDetailOpen(true)} />
                            : null
                }
                right={buttonPosition === "left"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
                        />
                        : null
                    : isEdit && textValue !== ""
                        ? <TextInput.Icon icon="check" onPress={handleOnBlur} />
                        : textValue !== ""
                            ? <TextInput.Icon icon="dots-horizontal" color={theme.colors.secondary} onPress={() => setDetailOpen(true)} />
                            : null
                }
                onBlur={handleOnBlur}
                style={{ width: "100%", textAlign: "left" }}
            />
            {isEdit
                ? null
                : <ScEmailDetail
                    currentItem={textValue}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </View>
    );
};

export default memo(ScEmailInput);

