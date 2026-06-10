import { useState, useEffect, memo } from "react";
import { RadioGroup, Radio, FormControl, FormControlLabel, FormLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

// Choose voucher Generation Type
const GenerationType = memo((props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
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
        if (value === 2 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(value);
        }
        setErrInfo(err);
        pickDone(value, itemKey, positionID, rowIndex, err);
    };

    // Actions after value changed
    const handleOnChange = (event) => {
        let newValue = parseInt(event.target.value);
        setFieldValue(newValue);
        handleTransfer(newValue);
    }
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label" error={errInfo.isErr}>{t("generationType")}</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="merage"
                value={fieldValue}
                onChange={handleOnChange}
                name="radio-buttons-group"
            >
                <FormControlLabel value={0} control={<Radio />} label={t("combinedGeneration")}/>
                <FormControlLabel value={1} control={<Radio />} label={t("separateGeneration")} />
            </RadioGroup>
        </FormControl>
    );
});

export default GenerationType;  