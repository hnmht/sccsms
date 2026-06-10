import { useState, memo, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { useTranslation } from "react-i18next";

//301 Seacloud Password Input Component
const ScPasswordInput = (props: ScInputProps<ScDataTypeList.Password>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = false,
        isEdit = true,
        itemShowName = "",
        itemKey,
        initValue = "",
        pickDone,
        placeholder = "",
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [textValue, setTextValue] = useState(initValue);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async (text: string) => {
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
    }

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, padding: 2, height: height }}>
            <TextInput
                mode="outlined"
                secureTextEntry={true}
                keyboardType="default"
                onChangeText={(text) => handleOnChangeText(text)}
                label={label}
                key={`password${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                placeholder={isEdit ? t(placeholder) : ""}
                value={textValue}
                error={errInfo.isErr}
                left={errInfo.isErr
                    ? <TextInput.Icon
                        icon="alert"
                        color={theme.colors.error}
                        onPress={() => Alert.alert(t("error"), t(errInfo.msg))}
                        disabled={!isEdit}
                    />
                    : null}
                onBlur={(text) => handleOnBlur(text)}
                style={{ width: "100%", textAlign: "left" }}
            />
        </View>
    );
};


export default memo(ScPasswordInput);
