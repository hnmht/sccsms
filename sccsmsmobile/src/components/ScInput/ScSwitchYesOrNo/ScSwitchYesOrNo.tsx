import { memo, useEffect, useState } from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { useTranslation } from "react-i18next";

// Convert bool to int
function boolTransInt(b: boolean): 1 | 0 {
    return b ? 1 : 0;
}
// Convert int to bool
function intTransBool(i: number): boolean {
    return i === 1;
}

//403 Seacloud Yes/No Input Component in the form of a Switch
const ScCheckYesOrNo = (props: ScInputProps<ScDataTypeList.SwitchYesOrNo>) => {
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
    const { t } = useTranslation();

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
        <View key={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text variant="bodyLarge">{t(itemShowName)}</Text>
            <Switch
                disabled={!isEdit}
                value={fieldValue}
                key={`switch${itemKey}${positionID}${rowIndex}`}
                onValueChange={handleOnBlur}
            />
        </View>
    );
};

export default memo(ScCheckYesOrNo);

