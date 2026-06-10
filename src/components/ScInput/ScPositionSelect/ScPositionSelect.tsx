import { memo, useState, useEffect } from "react";
import { View, Modal, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import PositionDetail from "./PositionDetail";
import PositionPicker from "./PositionPicker";
import { getEmptyPosition } from "../../../dataType/dataZero/position";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { useAppSelector } from "../../../store/hooks";
import { Position } from "../../../dataType/types/postion";
import { useTranslation } from "react-i18next";

const zeroValue = getEmptyPosition();
// 610  Seacloud Position Select input Component
const ScPositionSelect = (props: ScInputProps<ScDataTypeList.Position>) => {
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
    const [dialogPositionen, setDialogPositionen] = useState(false);
    const [detailPositionen, setDetailPositionen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + (itemShowName);
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

    // Actions after press cancel button in the PostionPicker modal
    const handleCancelAction = () => {
        setDialogPositionen(false);
    };
    // Actions after press Position item in the Position modal
    const handlePressItemAction = (item: Position) => {
        setCurrentDoc(item);
        handleTransfer(item);
        setDialogPositionen(false);
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
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
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
                        icon="account-group"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogPositionen(true) : () => setDetailPositionen(true)}
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
                        icon="account-group"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogPositionen(true) : () => setDetailPositionen(true)}
                        onLongPress={isEdit ? () => handleClear() : undefined}
                    />

                }
                style={{ width: "100%" }}
            />
            <Modal
                visible={dialogPositionen}
                id={`modal${itemKey}${positionID}${rowIndex}`}
            >
                <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                    <PositionPicker
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
                : <PositionDetail
                    currentItem={currentDoc}
                    visible={detailPositionen}
                    backAction={() => setDetailPositionen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </View>
    );
};
export default memo(ScPositionSelect);
