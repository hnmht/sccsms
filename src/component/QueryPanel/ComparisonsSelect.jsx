import { memo, useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Comparisons } from "./constructor";
import { useTranslation } from "react-i18next";

// Comparison Operators Select
const ComparisonsSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, pickDone, dataType, isEdit, selected } = props;
    const [fieldValue, setFieldValue] = useState(selected);
    const currentComps = Comparisons.filter((item) => item.applicable.includes(dataType));
    const inComps = currentComps.some((item) => item.id === fieldValue);
    const selectValue = inComps ? fieldValue : currentComps[0].id;
    const selectID = `S${itemKey}_${positionID}_${rowIndex}`;
    const inputID = `I${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();

    const handleChange = (event) => {
        let newValue = event.target.value;
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    // Pass data to the parent component
    const handleTransfer = (value) => {
        let objectValue = Comparisons.find(ele => ele.id === value);
        let errMsg = { isErr: false, msg: "" };
        pickDone(objectValue, itemKey, positionID, rowIndex, errMsg);
    };
    return (
        <FormControl fullWidth disabled={!isEdit}>
            <InputLabel htmlFor={inputID}>{t(itemShowName)}</InputLabel>
            <Select
                labelId={selectID}
                id={selectID}
                value={selectValue}
                label="Comparison Operators"
                onChange={handleChange}
                inputProps={{ id: inputID }}
            >
                {currentComps.map(c => <MenuItem value={c.id} key={c.id}>{t(c.label)}</MenuItem>)}
            </Select>
        </FormControl>
    );
};

export default memo(ComparisonsSelect);
