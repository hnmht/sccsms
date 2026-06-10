import { useState, memo, useEffect } from "react";
import {
    InputLabel,
    TextField,
    Tooltip,
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { useTranslation } from "react-i18next";
// Email regular expression
const mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

//305 Seacloud Email input component
const ScEmailInput = (props) => {
    const { positionID, fieldIndex, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, isBackendTest, backendTestFunc } = props;
    const [textValue, setTextValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `520_${itemKey}_${positionID}_${rowIndex}`;
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

    const handleOnBlur = async (event) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (textValue.trim() === "" && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (textValue.trim() !== "") {
            let isMoblie = mailRegex.test(textValue);
            err = isMoblie ? { isErr: false, msg: "" } : { isErr: true, msg: "emailIncorrect" };
        } else if (isBackendTest) {
            err = await backendTestFunc(textValue);
        }

        setErrInfo(err);
        pickDone(textValue, itemKey, fieldIndex, rowIndex, err);
    };

    const handleOnChange = (event) => {
        setErrInfo({ isErr: false, msg: "" });
        setTextValue(event.target.value);
    }

    return (
        <>
            <InputLabel htmlFor={`id`} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <TextField
                fullWidth
                autoComplete="true"
                type="text"
                id={`id`}
                disabled={!isEdit}
                name={id}
                placeholder={t(placeholder)}
                onChange={(event) => handleOnChange(event)}
                value={textValue}
                onBlur={handleOnBlur}
                error={errInfo.isErr}
                InputProps={{
                    endAdornment: errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null,
                }}
            />
        </>
    );
};

export default memo(ScEmailInput);