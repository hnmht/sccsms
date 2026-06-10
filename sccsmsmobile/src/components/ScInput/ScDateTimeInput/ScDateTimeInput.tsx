import { useEffect, memo, useState } from "react";
import { View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { dayjs, DateTimeFormat } from "../../../i18n/dayjs";
import { TextInput, useTheme, Button } from "react-native-paper";
import { DateTimeSpinner } from "react-native-date-time-spinner";
import { useAppSelector } from "../../../store/hooks";
import ScDateTimeDetail from "./ScDateTimeDetail";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { ScComponentModal } from "../../ScComponentModal/ScComponentModal";

const zeroValue = dayjs(new Date()).toDate();
//307 Seacloud Date Time Input Component
const ScDateTimeInput = (props: ScInputProps<ScDataTypeList.DateTime>) => {
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

    const [dateValue, setDateValue] = useState(dayjs(initValue).isValid() ? dayjs(initValue).toDate() : dayjs(new Date()).toDate());
    const [visible, setVisible] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    const dateDisplay = DateTimeFormat(dateValue, "LLL");

    useEffect(() => {
        function updateInitvalue() {
            setDateValue(dayjs(initValue).isValid() ? dayjs(initValue).toDate() : dayjs(new Date()).toDate());
        }
        updateInitvalue();
    }, [initValue]);

    const handleDateTimeChange = (confirmTime: Date) => {
        setDateValue(confirmTime);
    };

    const handleTransfer = async (newValue: Date = dateValue) => {
        if (!isEdit) {
            return
        }
        setVisible(false);
        let scFormatValue = dayjs(newValue).toISOString();
        pickDone(scFormatValue, itemKey, positionID, rowIndex, errInfo);
    };
    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                mode="outlined"
                keyboardType="default"
                label={label}
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                placeholder={isEdit ? t(placeholder) : ""}
                value={dateDisplay}
                editable={false}
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
                        icon="clock"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setVisible(true) : () => setDetailOpen(true)}
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
                        icon="clock"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setVisible(true) : () => setDetailOpen(true)}
                    />

                }
                style={{ width: "100%" }}
            />
            <ScComponentModal
                visible={visible}
            >
                <SafeAreaView style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.colors.background
                }}>
                    <DateTimeSpinner
                        mode="datetime"
                        initialValue={dateValue}
                        LinearGradient={LinearGradient}
                        dateTimeOrder={["date", "hour", "minute"]}
                        formatDateLabel={(date) => DateTimeFormat(date, "LL")}
                        pickerGradientOverlayProps={{
                            locations: [0, 0.4, 0.6, 1],
                        }}
                        onDateChange={({ date }) => handleDateTimeChange(date)}
                        styles={{
                            theme: theme.dark ? "dark" : "light",
                            pickerItem: { color: theme.colors.secondary }
                        }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16 }}>
                        <Button mode="text" onPress={() => setVisible(false)} style={{ margin: 8 }}>{t("cancel")}</Button>
                        <Button mode="contained" onPress={() => handleTransfer(dateValue)} style={{ margin: 8 }}>{t("ok")}</Button>
                    </View>
                </SafeAreaView>
            </ScComponentModal>
            {
                isEdit
                    ? null
                    : <ScDateTimeDetail
                        currentItem={dateDisplay}
                        visible={detailOpen}
                        backAction={() => setDetailOpen(false)}
                        t={t}
                        theme={theme}
                    />
            }

        </View>
    );
};

export default memo(ScDateTimeInput);

