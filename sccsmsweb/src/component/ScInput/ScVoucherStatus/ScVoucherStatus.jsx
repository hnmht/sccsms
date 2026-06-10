import { memo, useState, useEffect } from "react";
import {
    Tooltip,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    InputBase as InputBaseMUI,
    OutlinedInput
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { useTranslation } from "react-i18next";
const zeroValue = 0;
// Fixed an error caused by a MUI bug.
const InputBase = ({ notched, ...rest }) => {
    return <InputBaseMUI {...rest} />
};
// 401 Seacloud Voucher Status Component
const ScVoucherStatus = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const selectID = `S401${itemKey}_${positionID}_${rowIndex}`;
    const inputID = `I401${itemKey}_${positionID}_${rowIndex}`;
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

    // Transmit data to the parent component
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (isBackendTest) {
            err = await backendTestFunc(value);
        }
        setErrInfo(err);
        pickDone(value, itemKey, positionID, rowIndex, err);
    };

    // Actions after the state changed
    const handleOnChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={inputID} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <FormControl fullWidth sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "space-between" }}>
                <Select
                    disabled={!isEdit}
                    id={selectID}
                    displayEmpty
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    input={positionID !== 1
                        ? <OutlinedInput id={inputID} startAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                        : <InputBase id={inputID} startAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />}
                    sx={{ flex: 1 }}
                >
                    <MenuItem key={0} value={0}>{t("free")}</MenuItem>
                    <MenuItem key={1} value={1}>{t("confirmed")}</MenuItem>
                    <MenuItem key={2} value={2}>{t("executing")}</MenuItem>
                    <MenuItem key={3} value={3}>{t("completed")}</MenuItem>
                </Select>
            </FormControl>
        </>
    );
};

export default memo(ScVoucherStatus);