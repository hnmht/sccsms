import { useState, memo, useEffect } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../store/hooks";
import { TextInput, useTheme } from "react-native-paper";
import ScTextDetail from "./TextDetail";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

//301 Seacloud Text Input Component
const ScTextInput = (props: ScInputProps<ScDataTypeList.Text>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = false,
        isEdit = true,
        itemShowName = "",
        itemKey,
        initValue = "",
        pickDone,
        placeholder="",
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68,
        textLines = 1
    } = props;
    const [textValue, setTextValue] = useState(initValue);
    const [detailOpen, setDetailOpen] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    // Button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
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

        let newTextValue = "";
        if (textValue.length > 0) {
            newTextValue = textValue.trim();
        }

        setTextValue(newTextValue);
        pickDone(newTextValue, itemKey, positionID, rowIndex, errInfo);
    };

    const handleOnChangeText = (text: string) => {
        setTextValue(text);
    };


    return (
        <KeyboardAvoidingView id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                mode="outlined"
                keyboardType="default"
                onChangeText={(text) => handleOnChangeText(text)}
                label={label}
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                placeholder={isEdit ? t(placeholder) : ""}
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
                multiline={textLines !== 1}
                numberOfLines={textLines}
            />
            {isEdit
                ? null
                : <ScTextDetail
                    currentItem={textValue}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </KeyboardAvoidingView>
    );
};

export default memo(ScTextInput);

