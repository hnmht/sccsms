import { memo, useState, useEffect } from "react";
import {
    FormControlLabel,
    Switch,
} from "@mui/material";
import { useTranslation } from "react-i18next";
// Convert boolean to number 
function boolTransInt(b) {
    return b ? 1 : 0;
};

// Convert number to boolean
function intTransBool(i) {
    return i === 0 ? false : true;
}

// 402 Seacloud Switch Input Yes Or No component
const ScSwitchYesOrNo = (props) => {
    const { positionID, fieldIndex, rowIndex, isEdit, itemShowName, itemKey, initValue = 0, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const id = `402_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async (event) => { 
        if (!isEdit) {
            return
        }
        
        let newValue = boolTransInt(event.target.checked);
        let err = { isErr: false, msg: "" };
        setFieldValue(newValue);
        if (isBackendTest) {
            err = await backendTestFunc(newValue);
        }        
        pickDone(newValue, itemKey, positionID, rowIndex, err);
    };

    return (
        <FormControlLabel
            id={id}
            control={
                <Switch
                    disabled={!isEdit}
                    checked={intTransBool(fieldValue)}
                    id={id}
                    sx={{ mt: 0, mr: 0 }}
                    color={props.color ? props.color : "primary"}
                    onChange={handleOnBlur}
                />}
            label={t(itemShowName)}
            labelPlacement='start'
        />
    );
};

export default memo(ScSwitchYesOrNo);