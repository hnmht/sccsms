import { memo, useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { QueryField } from "../../dataType/types/queryPanel";
import { ErrMsg } from "../../dataType/types/scInput";
import { useTranslation } from "react-i18next";

interface FieldSelectProps {
    rowIndex: number;
    itemShowName: string;
    pickDone: (value: QueryField, rowIndex: number, errMsg: ErrMsg) => void;
    fields: QueryField[];
    isEdit: boolean;
    selected: QueryField;
}

const FieldSelect = (props: FieldSelectProps) => {
    const { rowIndex, itemShowName, pickDone, fields, isEdit, selected } = props;
    const [fieldValue, setFieldValue] = useState(selected ? selected : fields[0]);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    // Actions after Field Changes
    const handleChange = (newValue: QueryField) => {
        setVisible(false);
        setFieldValue(newValue);
        handleTransfer(newValue);
    };
    // Pass Data to parent Component
    const handleTransfer = (value: QueryField) => {
        let errMsg = { isErr: false, msg: "" };
        pickDone(value, rowIndex, errMsg);
    }

    return (
        <View id={`FieldView${rowIndex}`} style={{ width: "100%", padding: 2 }}>
            <Menu
                key={`fieldMenu${rowIndex}`}
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchorPosition="bottom"
                anchor={
                    <TextInput                 
                        mode="outlined"
                        keyboardType="default"
                        label={"*" + t(itemShowName)}
                        editable={false}
                        disabled={!isEdit}
                        value={t(fieldValue.label)}
                        right={
                            <TextInput.Icon
                                icon="arrow-down-drop-circle"
                                color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                                onPress={() => setVisible(true)}
                                disabled={!isEdit}
                            />
                        }
                        style={{ width: "100%" }}
                    />
                }
            >
                {fields.map((field, index) => <Menu.Item key={index} title={t(field.label)} onPress={() => handleChange(field)} />)}
            </Menu>
        </View>
    );
};

export default memo(FieldSelect);
