import { memo, useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../store/hooks";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { VoucherStatus } from "../../../constant/voucherStatus";

// 405 Seacloud Voucher Status Component
const ScVoucherStatus = (props: ScInputProps<ScDataTypeList.VoucherStatus>) => {
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
    const [fieldValue, setFieldValue] = useState(initValue);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    // Command buttons Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    // Pass data to parent component
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        setVisible(false);
        setFieldValue(value);
        pickDone(value, itemKey, positionID, rowIndex, errInfo);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <Menu
                key={`menu${itemKey}${positionID}${rowIndex}`}
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchorPosition="bottom"
                anchor={
                    <TextInput
                        id={itemKey}
                        mode="outlined"
                        keyboardType="default"
                        label={label}
                        placeholder={isEdit ? t(placeholder) : ""}
                        editable={false}
                        disabled={!isEdit}
                        value={t(VoucherStatus[fieldValue])}
                        error={errInfo.isErr}
                        left={buttonPosition === "right"
                            ? errInfo.isErr
                                ? <TextInput.Icon
                                    icon="alert"
                                    color={theme.colors.error}
                                    onPress={() => Alert.alert(t("error"), errInfo.msg)}
                                    disabled={!isEdit}
                                />
                                : null
                            : <TextInput.Icon
                                icon="format-list-bulleted-type"
                                color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                                onPress={() => setVisible(true)}
                                disabled={!isEdit}
                            />
                        }
                        right={buttonPosition === "left"
                            ? errInfo.isErr
                                ? <TextInput.Icon
                                    icon="alert"
                                    color={theme.colors.error}
                                    onPress={() => Alert.alert(t("error"), errInfo.msg)}
                                    disabled={!isEdit}
                                />
                                : null
                            : <TextInput.Icon
                                icon="format-list-bulleted-type"
                                color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                                onPress={() => setVisible(true)}
                                disabled={!isEdit}
                            />
                        }
                        style={{ width: "100%" }}
                    />
                }
            >
                <Menu.Item onPress={() => handleTransfer(0)} title={t(VoucherStatus[0])} />
                <Menu.Item onPress={() => handleTransfer(1)} title={t(VoucherStatus[1])} />
                <Menu.Item onPress={() => handleTransfer(2)} title={t(VoucherStatus[2])} />
                <Menu.Item onPress={() => handleTransfer(3)} title={t(VoucherStatus[3])} />
            </Menu>
        </View>
    );
}
export default memo(ScVoucherStatus);