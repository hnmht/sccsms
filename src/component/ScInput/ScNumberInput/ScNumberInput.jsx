import { useState, memo, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
    InputBase,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { NumericFormat } from "react-number-format";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";
const zeroValue = 0.00;
// 302 Seacloud Number Input Component
const ScNumberInput = (props) => {
    const { positionID = -1, rowIndex = -1, allowNull = false, isEdit = true, itemShowName, itemKey, initValue = zeroValue, pickDone, placeholder, isBackendTest = false, backendTestFunc } = props;
    const [textValue, setTextValue] = useState(initValue.toString());
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `302_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue.toString());
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleOnBlur();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    const handleOnBlur = async (event) => {
        if (!isEdit) {
            return
        }
        let newErrMsg = { isErr: false, msg: "" };
        let newNumber;

        let newTextValue = cloneDeep(textValue);
        if (textValue.length > 0) {
            newTextValue = textValue.trim();
        }
        // Convert string to number
        if (newTextValue === "0" || newTextValue === "") {
            newNumber = 0;
        } else {
            // Remove thousands separator
            newNumber = parseFloat(textValue.replace(/,/g, ''));
        }
        // More validation checks
        if (isBackendTest) {
            newErrMsg = await backendTestFunc(newNumber);
        }
        setErrInfo(newErrMsg);
        pickDone(newNumber, itemKey, positionID, rowIndex, newErrMsg);
    };

    const handleOnChange = (event) => {
        setErrInfo({ isErr: false, msg: "" });
        setTextValue(event.target.value);
    }

    const materialUITextFieldProps = positionID !== 1 ?
        {
            fullWidth: true,
            id: id,
            disabled: !isEdit,
            name: id,
            placeholder: t(placeholder),
            onChange: (event) => handleOnChange(event),
            InputProps: {
                sx: { "& input": { textAlign: "right" } },
                endAdornment: errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
            },
            inputProps: {
                id: id
            },
            onBlur: handleOnBlur,
            error: errInfo.isErr,
        }
        : {
            fullWidth: true,
            id: id,
            disabled: !isEdit,
            name: id,
            placeholder: t(placeholder),
            onChange: (event) => handleOnChange(event),
            endAdornment: errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
            onBlur: handleOnBlur,
            error: errInfo.isErr,
            sx: { "& input": { textAlign: "right" } },
            inputProps: {
                id: id
            }
        }
        ;

    return (
        <>
            {positionID !== 1
                ? <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
                : null
            }
            <NumericFormat
                value={textValue}
                customInput={positionID !== 1 ? TextField : InputBase}
                thousandsGroupStyle="thousand"
                thousandSeparator=","
                {...materialUITextFieldProps}
            />
        </>
    );
};

export default memo(ScNumberInput);