import { memo, useState, useEffect } from "react";
import {
    Stack,
    Checkbox,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Convert bool value to number
function boolTransInt(b) {
    return b ? 1 : 0;
};
// Convert number value to bool
function intTransBool(i) {
    return i === 1;
};

//403 CheckBox Yes Or No Component
const ScCheckYesOrNo = (props) => {
    const { positionID, rowIndex, isEdit, itemShowName, itemKey, initValue = 0, pickDone, isBackendTest, backendTestFunc } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const id = `403_${itemKey}_${positionID}_${rowIndex}`;
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
        <>
            {positionID !== 1
                ? <Stack id={`view${itemKey}${positionID}${rowIndex}`} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Checkbox
                        disabled={!isEdit}
                        checked={intTransBool(fieldValue)}
                        id={id}
                        sx={{ mt: 0, mr: 2 }}
                        color={props.color ? props.color : "primary"}
                        onChange={handleOnBlur}
                    />
                    <Typography>{t(itemShowName)}</Typography>
                </Stack>
                : <Checkbox
                    disabled={!isEdit}
                    checked={intTransBool(fieldValue)}
                    id={id}
                    sx={{ mt: 0, mr: 2 }}
                    color={props.color ? props.color : "primary"}
                    onChange={handleOnBlur}
                />
            }
        </>
    );
};

export default memo(ScCheckYesOrNo);