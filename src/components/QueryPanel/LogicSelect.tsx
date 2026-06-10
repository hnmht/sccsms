import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { ErrMsg } from "../../dataType/types/scInput";

interface logicSelectProps {
    rowIndex: number;
    itemShowName: string;
    isEdit: boolean;
    pickDone: (value: "and" | "or", rowIndex: number, errMsg: ErrMsg) => void;
}

const LogicSelect = (props: logicSelectProps) => {
    const { rowIndex, itemShowName, isEdit, pickDone } = props;
    const [fieldValue, setFieldValue] = useState("and");
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();

    const handleChange = (newValue: "and" | "or") => {
        setFieldValue(newValue);
        let errMsg = { isErr: false, msg: "" };
        setVisible(false);
        pickDone(newValue, rowIndex, errMsg);
    };

    return (
        <View id={`logicView$${rowIndex}`} style={{ width: "100%", padding: 2 }}>
            <Menu
                key={`logicMenu${rowIndex}`}
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
                        value={t(fieldValue)}
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
                <Menu.Item key={"and"} onPress={() => handleChange("and")} title={t("and")} />
                <Menu.Item key={"or"} onPress={() => handleChange("or")} title={t("or")} />
            </Menu>
        </View>

    );
};

export default memo(LogicSelect);