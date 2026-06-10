import { memo, useState, useEffect } from "react";
import {
    Tooltip,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    InputBase,
    OutlinedInput
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorIcon } from "../../PubIcon/PubIcon";

const zeroValue = "month";
//407 Seacloud Period Select component
const ScPeriodSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `407_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleTransfer(fieldValue);
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    // Pass data to the parent component
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (value === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(value);
        }
        setErrInfo(err);
        pickDone(value, itemKey, positionID, rowIndex, err);
    };

    // Actions after the item changed
    const handleOnChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <FormControl id={id} fullWidth sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "space-between" }}>
                <Select
                    disabled={!isEdit}
                    id={id}
                    displayEmpty
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    input={positionID !== 1
                        ? <OutlinedInput id={id} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                        : <InputBase id={id} startAdornment={errInfo.isErr ? <Tooltip title={errInfo.msg} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />}
                    sx={{ flex: 1 }}
                >
                    <MenuItem key={"month"} value={"month"}>{t("month")}</MenuItem>
                    <MenuItem key={"day"} value={"day"}>{t("day")}</MenuItem>
                    <MenuItem key={"week"} value={"week"}>{t("week")}</MenuItem>
                    <MenuItem key={"tenDayPeriod"} value={"tenDayPeriod"}>{t("tenDayPeriod")}</MenuItem>
                    <MenuItem key={"halfMonth"} value={"halfMonth"}>{t("halfMonth")}</MenuItem>
                    <MenuItem key={"quarter"} value={"quarter"}>{t("quarter")}</MenuItem>
                    <MenuItem key={"halfAYear"} value={"halfAYear"}>{t("halfAYear")}</MenuItem>
                    <MenuItem key={"year"} value={"year"}>{t("year")}</MenuItem>
                </Select>
            </FormControl>
        </>
    );
};

export default memo(ScPeriodSelect);