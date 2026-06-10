import { useState, useEffect, memo } from "react";
import { ErrorIcon, ClockIcon } from "../../PubIcon/PubIcon";
import {
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
    InputAdornment,
    Stack
} from "@mui/material";
import { DateTimeInputMask, dayjs } from "../../../i18n/dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useTranslation } from "react-i18next";
const zeroValue = dayjs(new Date());
//307 Seacloud Date time Input Component
const ScDateTimeInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [dateValue, setDateValue] = useState(initValue ? initValue : zeroValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `307_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    const mask = DateTimeInputMask();
    useEffect(() => {
        function updateInitvalue() {
            setDateValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleOnBlur(dateValue);
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    const handleOnBlur = async (newValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (newValue === undefined && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (newValue !== undefined && !dayjs(newValue).isValid()) {
            err = { isErr: true, msg: "enterValidDate" };
        } else if (isBackendTest) {
            err = await backendTestFunc(newValue, itemKey, positionID, rowIndex);
        }

        setErrInfo(err);
        pickDone(newValue, itemKey, positionID, rowIndex, err);
    };

    const OpenPickIcon = () => <ClockIcon color={isEdit ? "success" : "transparent"} fontSize="small" sx={{ margin: 0, padding: 0 }} />

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <DateTimePicker
                value={dateValue}
                ampm={false}
                onChange={(newValue) => {
                    handleOnBlur(newValue);
                }}
                inputFormat={mask}
                disabled={!isEdit}
                components={{
                    OpenPickerIcon: OpenPickIcon
                }}
                componentsProps={{
                    endAdornment: { sx: { margin: 0, padding: 0 } }
                }}
                renderInput={({ InputProps, ...params }) => {
                    return positionID !== 1
                        ? <TextField
                            {...params}
                            fullWidth
                            id={id}
                            disabled={!isEdit}
                            name={id}
                            error={errInfo.isErr}
                            InputProps={{
                                ...InputProps,
                                endAdornment: (
                                    <Stack sx={{ display: "flex", flexDirection: "row", padding: 0, margin: 0, alignItems: "center" }}>
                                        <InputAdornment position="end" sx={{ margin: 0, padding: 0 }}>
                                            {
                                                errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null
                                            }
                                            <Tooltip title={t("chooseTime")} placement="top">
                                                {InputProps?.endAdornment}
                                            </Tooltip>
                                        </InputAdornment>
                                    </Stack>

                                )
                            }}
                        />
                        : <InputBase
                            {...params}
                            fullWidth
                            id={id}
                            disabled={!isEdit}
                            name={id}
                            error={errInfo.isErr}
                            endAdornment={
                                <InputAdornment
                                    position="end"
                                    sx={{
                                        "& .MuiInputAdornment-root": {
                                            marginLeft: 0,
                                            padding: 0,
                                        },
                                        "& .MuiButtonBase-root": {
                                            margin: 0,
                                            paddingX: 1,
                                        }
                                    }}>
                                    {
                                        errInfo.isErr
                                            ? <Tooltip title={t(errInfo.msg)} placement="top">
                                                <ErrorIcon fontSize="small" color="error" />
                                            </Tooltip>
                                            : null
                                    }
                                    <Tooltip title={t("chooseTime")} placement="top">
                                        {InputProps?.endAdornment}
                                    </Tooltip>
                                </InputAdornment>
                            }
                        />
                }}
            />
        </>
    );
};

export default memo(ScDateTimeInput);

