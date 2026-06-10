import { memo, useState, useEffect } from "react";
import { View, Modal, Alert, Text } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { transformProps } from "./constructor";
import RLDetail from "./RLDetail";
import RLPicker from "./RLPicker";
import { getEmptyRiskLevel } from "../../../dataType/dataZero/riskLevel";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { RiskLevel } from "../../../dataType/types/riskLevel";
import { useAppSelector } from "../../../store/hooks";
import { useTranslation } from "react-i18next";

const zeroValue = getEmptyRiskLevel();
// 590 Seacloud Risk Level select input component
const ScRLSelect = (props: ScInputProps<ScDataTypeList.RiskLevel>) => {
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
    const [currentDoc, setCurrentDoc] = useState<RiskLevel>(initValue);
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

    // Actions after press cancel button in the RLPicker modal
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    // Actions after press Risk Level item in the RLPicker modal
    const handlePressItemAction = (item: RiskLevel) => {
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
                render={props => {
                    const newStyles = transformProps(props);
                    return (
                        <View
                            style={{
                                marginLeft: buttonPosition === "left" ? 36 : 0,
                                marginRight: buttonPosition === "right" ? 36 : 0,
                                height: newStyles.height,
                                paddingHorizontal: newStyles.paddingHorizontal,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            <View style={{ height: newStyles.height / 2, width: 48, backgroundColor: currentDoc.color, margin: 0, padding: 0, marginRight: 4, marginLeft: 4, borderRadius: 8 }} />
                            <Text style={{ color: newStyles.placeholderTextColor, fontSize: newStyles.fontSize }}>{currentDoc.name}</Text>
                        </View>
                    )
                }}
                left={buttonPosition === "right"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
                        />
                        : null
                    : <TextInput.Icon
                        icon="alarm-light"
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
                        icon="alarm-light"
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
                    <RLPicker
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
                : <RLDetail
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
export default memo(ScRLSelect);
