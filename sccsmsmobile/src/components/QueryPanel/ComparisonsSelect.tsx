import { memo, useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { Comparisons } from "../../dataType/dataZero/queryPanel";
import { ErrMsg } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { Comparison } from "../../dataType/types/queryPanel";
import { useTranslation } from "react-i18next";

interface comparisonsSelectProps {
    rowIndex: number;
    itemShowName: string;
    pickDone: (value: Comparison, rowIndex: number, errMsg: ErrMsg) => void;
    dataType: ScDataTypeList;
    isEdit: boolean;
    selected: Comparison;
}

const ComparisonsSelect = (props: comparisonsSelectProps) => {
    const { rowIndex, itemShowName, pickDone, dataType, isEdit, selected } = props;
    const currentComps = Comparisons.filter((item) => item.applicable.includes(dataType));
    const [fieldValue, setFieldValue] = useState(selected ? selected : currentComps[0]);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const handleChange = (newValue: Comparison) => {
        setVisible(false);
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    // Pass Data to the parent component
    const handleTransfer = (value: Comparison) => {
        let errMsg: ErrMsg = { isErr: false, msg: "" };
        pickDone(value, rowIndex, errMsg);
    };

    return (
        <View id={`comparisonsView${rowIndex}`} style={{ width: "100%", padding: 2 }}>
            <Menu
                key={`comparisonsMenu${rowIndex}`}
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchorPosition="bottom"
                anchor={
                    <TextInput
                        mode="outlined"
                        keyboardType="default"
                        label={"*" + itemShowName}
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
                {currentComps.map(c => <Menu.Item key={c.id} title={t(c.label)} onPress={() => handleChange(c)} />)}
            </Menu>
        </View>
    );
};

export default memo(ComparisonsSelect);
