import { memo, useEffect, useState } from "react";
import { View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

// Convert Boolean to Number
function boolTransInt(b: boolean): 0 | 1 {
    return b ? 1 : 0;
}
// Convert Number to Boolean
function intTransBool(i: number): boolean {
    return i === 1;
}

//402 Seacloud Yes/No Input Component in the form of a CheckBox
const ScCheckYesOrNo = (props: ScInputProps<ScDataTypeList.CheckYesOrNo>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        placeholder = "",
        itemKey,
        initValue = 0,
        pickDone,
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [fieldValue, setFieldValue] = useState(intTransBool(initValue));
    const theme = useTheme();
    const {t} = useTranslation();

    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(intTransBool(initValue));
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        let newValue = boolTransInt(!fieldValue);
        setFieldValue(!fieldValue);
        pickDone(newValue, itemKey, positionID, rowIndex, errInfo);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <Checkbox.Item
                disabled={!isEdit}
                status={fieldValue ? "checked" : "unchecked"}
                key={`checkbox${itemKey}${positionID}${rowIndex}`}
                onPress={handleOnBlur}
                label={t(itemShowName) ?? ""}
                labelStyle={{ color: props.color ? props.color : theme.colors.onSurfaceDisabled }}
            />
        </View>
    );
};

export default memo(ScCheckYesOrNo);

