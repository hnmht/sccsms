import { memo, useState, useEffect } from "react";
import {
    Tooltip,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    InputBase,
    OutlinedInput,
    Typography
} from "@mui/material";
import { ErrorIcon } from "../../PubIcon/PubIcon";
import { scColors } from "./constructor";
import { useTranslation } from "react-i18next";
const zeroValue = "blue";

// 406 Seacloud Color Select component
const ScSelectColor = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue = zeroValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const selectID = `S406${itemKey}_${positionID}_${rowIndex}`;
    const inputID = `I406${itemKey}_${positionID}_${rowIndex}`;
    const {t} = useTranslation();

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

    // Actions after the Item change
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
            <FormControl id={selectID} fullWidth sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "space-between" }}>
                <Select
                    disabled={!isEdit}
                    id={selectID}
                    onChange={(event) => handleOnChange(event)}
                    value={fieldValue}
                    error={errInfo.isErr}
                    input={positionID !== 1
                        ? <OutlinedInput id={inputID} startAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />
                        : <InputBase id={inputID} startAdornment={errInfo.isErr ? <Tooltip title={t(errInfo.msg)} placement="top"><ErrorIcon fontSize="small" color="error" /></Tooltip> : null} />}
                    sx={{ flex: 1 }}
                >
                    {scColors.map((color, index) => (
                        <MenuItem key={index} value={color}>
                            <div style={{ display: "flex", justifyContent: "left", flexDirection: "row" }}>
                                <div style={{ minHeight: 16, minWidth: 32, borderRadius:4,backgroundColor: color,marginRight:4 }} />
                                <Typography variant="body1"> {t(color)}</Typography>
                            </div>
                        </MenuItem>
                    ))
                    }
                </Select>
            </FormControl>
        </>
    );
};

export default memo(ScSelectColor);