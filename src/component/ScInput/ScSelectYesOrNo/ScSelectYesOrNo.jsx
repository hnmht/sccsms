import { Fragment, memo, useState, useEffect } from "react";
import {
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Tooltip,
    InputBase as InputBaseMUI,
    OutlinedInput,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ErrorIcon } from "../../PubIcon/PubIcon";

const zeroValue = 2;
// Fixed an error caused by a MUI bug.
const InputBase = ({ notched, ...rest }) => {
    return <InputBaseMUI {...rest} />
};
//404 Seacloud Select Input Yes or No Component
const ScSelectYesOrNo = ({
    rowIndex = 0,
    positionID = 0,
    allowNull,
    isEdit,
    itemShowName,
    itemKey,
    initValue = zeroValue,
    pickDone,
    isBackendTest,
    backendTestFunc = () => { }
}) => {
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const selectID = `S406${itemKey}_${positionID}_${rowIndex}`;
    const inputID = `I406${itemKey}_${positionID}_${rowIndex}`;
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

    // To pass data to parent component
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (value === 2 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(value);
        }
        setErrInfo(err);
        pickDone(value, itemKey, positionID, rowIndex, err);
    };

    // Actions after MenuItem change.
    const handleOnChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        handleTransfer(newValue);
    }
    return (
        <Fragment>
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
                    sx={{ flex: 1 }}
                    input={
                        positionID !== 1
                            ? <OutlinedInput id={inputID} fullWidth startAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                            : <InputBase id={inputID} fullWidth startAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                    }
                >
                    <MenuItem key={2} value={2}></MenuItem>
                    <MenuItem key={0} value={0}>{t("N")}</MenuItem>
                    <MenuItem key={1} value={1}>{t("Y")}</MenuItem>
                </Select>
            </FormControl>
        </Fragment>
    );
};

export default memo(ScSelectYesOrNo);