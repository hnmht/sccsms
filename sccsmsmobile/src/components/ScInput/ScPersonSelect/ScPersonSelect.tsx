import { memo, useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { ScComponentModal } from "../../ScComponentModal/ScComponentModal";
import PersonPicker from "./PersonPicker";
import { useAppSelector } from "../../../store/hooks";
import PersonDetail from "./PersonDetail";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { getEmptyPerson } from "../../../dataType/dataZero/person";
import { Person } from "../../../dataType/types/person";
import { useTranslation } from "react-i18next";

const zeroValue = getEmptyPerson();
//510 Seacloud Person Select Component
const ScPersonSelect = (props: ScInputProps<ScDataTypeList.Person>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        itemKey,
        initValue = zeroValue,
        pickDone,
        placeholder="",
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [person, setPerson] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + (itemShowName);
    // Commands button postion
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        setPerson(initValue);
    }, [initValue]);

    // Pass data to the parent component
    const handleTransfer = async (doc = person) => {
        if (!isEdit) {
            return
        }
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };

    // Actions after press Cancel button
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    // Actions after press ok button
    const handlePressItemAction = (item: Person) => {
        setPerson(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    // Actions after press clear button
    const handleClear = () => {
        if (!allowNull) {
            return
        }
        setPerson(zeroValue);
        handleTransfer(zeroValue);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                id={`textinput${itemKey}${positionID}${rowIndex}`}
                mode="outlined"
                keyboardType="default"
                label={t(itemShowName)}
                placeholder={isEdit ? t(placeholder) : ""}
                editable={false}
                disabled={!isEdit}
                value={person.name}
                error={errInfo.isErr}
                left={
                    buttonPosition === "right"
                        ? errInfo.isErr
                            ? <TextInput.Icon
                                icon="alert"
                                color={theme.colors.error}
                                onPress={() => Alert.alert(t("error"), errInfo.msg)}
                            />
                            : null
                        : <TextInput.Icon
                            icon="account-multiple"
                            color={isEdit ? theme.colors.primary : theme.colors.secondary}
                            onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                            onLongPress={isEdit ? (e) => handleClear() : undefined}
                        />
                }
                right={
                    buttonPosition === "left"
                        ? errInfo.isErr
                            ? <TextInput.Icon
                                icon="alert"
                                color={theme.colors.error}
                                onPress={() => Alert.alert(t("error"), errInfo.msg)}
                            />
                            : null
                        : <TextInput.Icon
                            icon="account-multiple"
                            color={isEdit ? theme.colors.primary : theme.colors.secondary}
                            onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                            onLongPress={isEdit ? (e) => handleClear() : undefined}
                        />
                }
                style={{ width: "100%" }}
            />
            <ScComponentModal
                visible={dialogOpen}
                key={`modal${itemKey}${positionID}${rowIndex}`}
            >
                <PersonPicker                  
                    cancelAction={handleCancelAction}
                    pressItemAction={handlePressItemAction}  
                    currentItem={person} 
                    t={t} 
                    theme={theme}                
                />
            </ScComponentModal>
            {isEdit
                ? null
                : <PersonDetail                    
                    currentItem={person}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                    theme={theme}
                />
            }
        </View>
    );
};

export default memo(ScPersonSelect);
