import { memo, useState } from "react";
import { View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { DateTimeFormat, CheckTimeEpoch } from "../../../i18n/dayjs";

import { TextInput, useTheme } from "react-native-paper";
import { useAppSelector } from "../../../store/hooks";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import ScDateTimeDetail from "../ScDateTimeInput/ScDateTimeDetail";

//309 Seacloud Date Time Display Component
const ScDateTimeDisp = (props: ScInputProps<ScDataTypeList.DateTimeDisp>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        itemKey,
        initValue,
        pickDone,
        placeholder = "",
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const isEpoch = CheckTimeEpoch(initValue);
    const content = isEpoch ? "" : DateTimeFormat(initValue, "LLL");
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const label = allowNull ? t(itemShowName) : "*" + t(itemShowName);
    // Commands button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                mode="outlined"
                keyboardType="default"
                label={label}
                id={`${itemKey}${positionID}${rowIndex}`}
                disabled={!isEdit}
                placeholder={isEdit ? t(placeholder) : ""}
                value={content}
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
                    : isEpoch
                        ? null
                        : <TextInput.Icon
                            icon="clock"
                            color={isEdit ? theme.colors.primary : theme.colors.secondary}
                            onPress={() => setDetailOpen(true)}
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
                    : isEpoch
                        ? null
                        : <TextInput.Icon
                            icon="clock"
                            color={isEdit ? theme.colors.primary : theme.colors.secondary}
                            onPress={() => setDetailOpen(true)}
                        />

                }
                style={{ width: "100%" }}
            />

            {
                isEpoch
                    ? null
                    : <ScDateTimeDetail
                        currentItem={content}
                        visible={detailOpen}
                        backAction={() => setDetailOpen(false)}
                        t={t}
                        theme={theme}
                    />
            }
        </View>
    );
};

export default memo(ScDateTimeDisp);

