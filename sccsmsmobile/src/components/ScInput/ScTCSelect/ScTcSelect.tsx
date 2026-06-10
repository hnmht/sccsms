import { memo, useState, useEffect } from "react";
import { View, Modal, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import TCDetail from "./TCDetail";
import TCPicker from "./TCPicker";
import { getEmptyTC } from "../../../dataType/dataZero/tc";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { useAppSelector } from "../../../store/hooks";
import { TC } from "../../../dataType/types/tc";

const zeroValue = getEmptyTC();
// 620 Seacloud Traning Course Select Input
const ScTcSelect = (props: ScInputProps<ScDataTypeList.TC>) => {
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
    const [currentDoc, setCurrentDoc] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    // Switch button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        setCurrentDoc(initValue);
    }, [initValue]);

    // Check value and pass data to the parents component
    const handleTransfer = async (doc = currentDoc) => {
        if (!isEdit) {
            return
        }
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };

    // Actions after press cancel button in the TCPicker modal
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    // Actions after press Training Course item in the TCPicker modal
    const handlePressItemAction = (item: TC) => {
        setCurrentDoc(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    // Actions after press clear button
    const handleClear = () => {
        if (!allowNull) {
            return
        }
        setCurrentDoc(zeroValue);
        handleTransfer(zeroValue);
    };

    return (
        <View id={`viewtc${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                id={`textinput${itemKey}${positionID}${rowIndex}`}
                mode="outlined"
                keyboardType="default"
                label={label}
                placeholder={isEdit ? t(placeholder) : ""}
                editable={false}
                disabled={!isEdit}
                value={currentDoc.name}
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
                        icon="book-open-variant"
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
                        icon="book-open-variant"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : undefined}
                    />

                }
                style={{ width: "100%" }}
            />
            <Modal
                visible={dialogOpen}
                id={`modeltc${itemKey}${positionID}${rowIndex}`}
            >
                <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                    <TCPicker
                        cancelAction={handleCancelAction}
                        pressItemAction={handlePressItemAction}
                        currentItem={currentDoc}
                        t={t}
                        theme={theme}
                    />
                </View>
            </Modal>
            {isEdit
                ? null
                : <TCDetail
                    currentItem={currentDoc}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </View>
    );
};
export default memo(ScTcSelect);