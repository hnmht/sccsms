import { memo, useState } from "react"
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

// Select the logic operator
const LogicSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, isEdit, pickDone } = props;
    const [fieldValue, setFieldValue] = useState("and");
    const selectID = `S${itemKey}_${positionID}_${rowIndex}`;
    const inputID = `I${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    const handleChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        let errMsg = { isErr: false, msg: "" };
        pickDone(newValue, itemKey, positionID, rowIndex, errMsg);
    };

    return (
        <FormControl fullWidth disabled={!isEdit} >
            <InputLabel htmlFor={inputID}>{t(itemShowName)}</InputLabel>
            <Select
                labelId={inputID}
                id={selectID}
                value={fieldValue}
                label={t("logic")}
                onChange={handleChange}
                inputProps={{ id: inputID }}
            >
                <MenuItem key="and" value="and">{t("and")}</MenuItem>
                <MenuItem key="or" value="or">{t("or")}</MenuItem>
            </Select>
        </FormControl>
    );
};

export default memo(LogicSelect);
