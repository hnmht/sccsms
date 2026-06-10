import { memo, useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../store/hooks";
import DeptPicker from "./DeptPicker";
import DeptDetail from "./DeptDetail";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { getEmptySimpDept } from "../../../dataType/dataZero/department";
import { SimpDept } from "../../../dataType/types/department";
import { useTranslation } from "react-i18next";
import { ScComponentModal } from "../../ScComponentModal/ScComponentModal";

const zeroValue = getEmptySimpDept();
// 520 Seacloud SimpDept Select Component
const ScDeptSelect = (props: ScInputProps<ScDataTypeList.SimpDept>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        itemKey,
        initValue = zeroValue,
        pickDone,
        placeholder = "",
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [currentDept, setCurrentDept] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);

    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        setCurrentDept(initValue);
    }, [initValue]);

    // Pass value to the parent component
    const handleTransfer = async (doc = currentDept) => {
        if (!isEdit) {
            return
        }
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };

    // Actions after press cancle button
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    // Actions after press SimpDept item
    const handlePressItemAction = (item: SimpDept) => {
        setCurrentDept(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    // Actions after press clear button
    const handleClear = () => {
        if (!allowNull) {
            return
        }
        setCurrentDept(zeroValue);
        handleTransfer(zeroValue);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                id={`textinput${itemKey}${positionID}${rowIndex}`}
                mode="outlined"
                keyboardType="default"
                label={label}
                placeholder={isEdit ? t(placeholder) : ""}
                editable={false}
                disabled={!isEdit}
                value={currentDept.name}
                error={errInfo.isErr}
                left={buttonPosition === "right"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
                        />
                        : null
                    : <TextInput.Icon
                        icon="office-building"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : () => { }}
                    />
                }
                right={buttonPosition === "left"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
                        />
                        : null
                    : <TextInput.Icon
                        icon="office-building"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : () => { }}
                    />

                }
                style={{ width: "100%" }}
            />
            <ScComponentModal
                visible={dialogOpen}
            >
                <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                    <DeptPicker
                        cancelAction={handleCancelAction}
                        pressItemAction={handlePressItemAction}
                        currentItem={currentDept}
                        t={t}
                        theme={theme}
                    />
                </SafeAreaView>
            </ScComponentModal>
            {isEdit
                ? null
                : <DeptDetail
                    currentItem={currentDept}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </View>
    );
};

export default memo(ScDeptSelect);