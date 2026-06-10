import { useState, memo, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { sanitizeInput, formatWithThousands, parseToNumber } from "./construction";

//302 SeaCloud Number Input Component
const ScNumberInput = (props: ScInputProps<ScDataTypeList.Number>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        placeholder = "",
        itemKey,
        initValue = 0.00,
        pickDone,
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [textValue, setTextValue] = useState(initValue.toString());
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue.toString());
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        if (textValue === "-" || textValue === "." || textValue === "-.") {
            setTextValue("");
        }
        const newErrMsg = { isErr: false, msg: "" };

        const newNumber: number = parseToNumber(textValue);

        pickDone(newNumber, itemKey, positionID, rowIndex, newErrMsg);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                mode="outlined"
                keyboardType="numeric"
                onChangeText={(text) => setTextValue(sanitizeInput(text))}
                label={label}
                key={`number${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                placeholder={isEdit ? t(placeholder) : ""}
                value={formatWithThousands(textValue)}
                error={errInfo.isErr}
                left={errInfo.isErr
                    ? <TextInput.Icon
                        icon="alert"
                        color={theme.colors.error}
                        onPress={() => Alert.alert(t("error"), errInfo.msg)}
                        disabled={!isEdit}
                    />
                    : null}
                onBlur={handleOnBlur}
                style={{ width: "100%", textAlign: "right" }}
            />
        </View>
    );
};


export default memo(ScNumberInput);

