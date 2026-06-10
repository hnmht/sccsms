import { useState, memo, useEffect, forwardRef } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { PatternFormat } from "react-number-format"
import { useTranslation } from "react-i18next";

// Regular expression
const moblieRegex = new RegExp("^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\\d{8}$");

const mobileFormat = forwardRef(function mobileFormat(props, ref) {
    const { onChange, ...other } = props;
    return (
        <PatternFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            valueIsNumericString
            format="### #### ####"
            mask={"_"}
        />
    )
});

// 304 Mobile phone number input component
const ScMobileInput = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [textValue, setTextValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `304_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    useEffect(() => {
        function updateInitvalue() {
            setTextValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    useEffect(() => {
        handleOnBlur();
        // eslint-disable-next-line
    }, [allowNull, isBackendTest]);

    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (textValue.trim() === "" && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (textValue.trim() !== "") {
            let isMoblie = moblieRegex.test(textValue);
            err = isMoblie ? { isErr: false, msg: "" } : { isErr: true, msg: "mobileIncorrect" };
        } else if (isBackendTest) {
            err = await backendTestFunc(textValue);
        }
        setErrInfo(err);
        pickDone(textValue, itemKey, positionID, rowIndex, err);
    };

    const handleOnChange = (event) => {
        setErrInfo({ isErr: false, msg: "" });
        setTextValue(event.target.value);
    };

    return (
        <>
            <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <TextField
                fullWidth
                type="text"
                id={id}
                disabled={!isEdit}
                name={id}
                placeholder={isEdit ? t(placeholder) : ""}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}
                InputProps={{
                    inputComponent: mobileFormat,
                    endAdornment: errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
                }}
            />
        </>
    );
};

export default memo(ScMobileInput);