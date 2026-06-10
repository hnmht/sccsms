import { memo, useState, useEffect } from "react";
import { View, Modal, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import UDCDetail from "./UDCDetail";
import UDCPicker from "./UDCPicker";
import { getEmptyUDC } from "../../../dataType/dataZero/udc";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { useAppSelector } from "../../../store/hooks";
import { UserDefineCategory } from "../../../dataType/types/udc";

const zeroValue = getEmptyUDC();
// 530 Seacloud UserDefineCateory Select Input Component
const ScUDCSelect = (props: ScInputProps<ScDataTypeList.UserDefineCategory>) => {
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

    // Actions after press cancel button in the UDCPicker Modal
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    // Actions after press item in the UDCPicker Modal
    const handlePressItemAction = (item: UserDefineCategory) => {
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
                        icon="home-city"
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
                        icon="home-city"
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
                    <UDCPicker
                        cancelAction={handleCancelAction}
                        currentItem={currentDoc}
                        pressItemAction={handlePressItemAction}
                        t={t}
                        theme={theme}
                    />
                </View>
            </Modal>
            {isEdit
                ? null
                : <UDCDetail
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

export default memo(ScUDCSelect);
