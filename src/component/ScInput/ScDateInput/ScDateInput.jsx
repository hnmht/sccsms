import { useState, useEffect, memo } from "react";
import { ErrorIcon, CalendarMonthIcon } from "../../PubIcon/PubIcon";
import {
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
    InputAdornment
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateInputMask, dayjs } from "../../../i18n/dayjs";

const defaultValue = dayjs(new Date());
// 306 SeaCloud Date input Component
const ScDateInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = defaultValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [dateValue, setDateValue] = useState(initValue ? initValue : defaultValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `306_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    const mask = DateInputMask();
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
        const value = dayjs(newValue).startOf("day");
        setErrInfo(err);
        pickDone(newValue, itemKey, positionID, rowIndex, err);
    };

    const DatePickIcon = () => <CalendarMonthIcon color={isEdit ? "success" : "transparent"} fontSize="small" />

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <DatePicker
                value={dateValue}
                onChange={(newValue) => {
                    handleOnBlur(newValue);
                }}
                inputFormat={mask}
                disabled={!isEdit}
                components={{
                    OpenPickerIcon: DatePickIcon,
                }}
                renderInput={(params) => {
                    return positionID !== 1
                        ? <TextField
                            {...params}
                            fullWidth
                            id={id}
                            disabled={!isEdit}
                            name={id}
                            error={errInfo.isErr}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
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
                                        }}
                                    >
                                        {
                                            errInfo.isErr
                                                ? <Tooltip title={t(errInfo.msg)} placement="top">
                                                    <ErrorIcon fontSize="small" color="error" />
                                                </Tooltip>
                                                : null
                                        }
                                        <Tooltip title={t("chooseDate")} placement="top">
                                            {params.InputProps?.endAdornment}
                                        </Tooltip>
                                    </InputAdornment>
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
                                    }}
                                >
                                    {
                                        errInfo.isErr
                                            ? <Tooltip title={errInfo.msg} placement="top">
                                                <ErrorIcon fontSize="small" color="error" />
                                            </Tooltip> : null
                                    }
                                    <Tooltip title={t("chooseDate")} placement="top">
                                        {params.InputProps?.endAdornment}
                                    </Tooltip>
                                </InputAdornment>
                            }
                        />
                }}
            />
        </>
    );
};

export default memo(ScDateInput);
