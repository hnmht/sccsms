import { memo, useState, useEffect } from "react";
import { View, Modal, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import DCPicker from "./DCPicker";
import DCDetail from "./DCDetail";
import { getEmptySimpDC } from "../../../dataType/dataZero/dc";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { SimpDC } from "../../../dataType/types/dc";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../store/hooks";

const zeroValue = getEmptySimpDC();
// 600 Seacloud Document Category Select Input Component
const ScDcSelect = (props: ScInputProps<ScDataTypeList.SimpDC>) => {
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
    const [currentDc, setCurrentDc] = useState<SimpDC>(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    // Switch button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        setCurrentDc(initValue);
    }, [initValue]);

    // Check value and pass data to the parents component
    const handleTransfer = async (doc = currentDc) => {
        if (!isEdit) {
            return
        }
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };

    // Actions after press cancel button in DCPicker modal
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    // Actions after press item in DCPicker modal
    const handlePressItemAction = (item: SimpDC) => {
        setCurrentDc(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    // Actions after press clear button
    const handleClear = () => {
        if (!allowNull) {
            return
        }
        setCurrentDc(zeroValue);
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
                value={currentDc.name}
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
                        icon="folder-search"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : undefined}
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
                        icon="folder-search"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : undefined}
                    />

                }
                style={{ width: "100%" }}
            />
            <Modal
                visible={dialogOpen}
                id={`modal${itemKey}${positionID}${rowIndex}`}
            >
                <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                    <DCPicker
                        cancelAction={handleCancelAction}
                        pressItemAction={handlePressItemAction}
                        currentItem={currentDc}
                        t={t}
                        theme={theme}
                    />
                </View>
            </Modal>
            {isEdit
                ? null
                : <DCDetail
                    currentItem={currentDc}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </View>
    );
};

export default memo(ScDcSelect);