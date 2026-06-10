import { memo, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

// Query Field Select
const FieldSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, pickDone, fields, isEdit, selected } = props;
    const [fieldValue, setFieldValue] = useState(selected ? selected : fields[0].id);
    const selectID = `S${itemKey}_${positionID}_${rowIndex}`;
    const inputID = `I${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    // Actions after select item changed
    const handleChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        let value = fields.find(ele => ele.id === newValue);
        handleTransfer(value);
    };
    // Pass data to the parent component
    const handleTransfer = (value) => {
        let errMsg = { isErr: false, msg: "" };
        pickDone(value, itemKey, positionID, rowIndex, errMsg);
    }

    return (
        <FormControl fullWidth disabled={!isEdit}>
            <InputLabel htmlFor={inputID} >{t(itemShowName)}</InputLabel>
            <Select
                labelId={inputID}
                id={selectID}
                value={fieldValue}
                label={t("field")}
                onChange={handleChange}
                inputProps={{ id: inputID }}
            >
                {fields.map((field, index) => <MenuItem value={field.id} key={index} >{t(field.label)}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default memo(FieldSelect);
