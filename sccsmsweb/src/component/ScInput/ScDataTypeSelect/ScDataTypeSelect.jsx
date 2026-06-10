import { useState, memo } from "react";
import {
    Box,
    TextField,
    Autocomplete,
    InputLabel,
} from "@mui/material";
import { DataTypes, DataIcon } from "../../../storage/dataTypes";
import { useTranslation } from "react-i18next";

//101 Data Type selection input component(Cannot be empty) 
const ScDataTypeSelect = (props) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, isBackendTest, backendTestFunc } = props;
    const [currentType, setCurrentType] = useState(initValue ? initValue : DataTypes[0]);
    const [errInfo, setErrInfo] = useState({ isErr: false, msg: "" });
    const id = `101_${itemKey}_${positionID}_${rowIndex}`;
    const { t } = useTranslation();
    console.log("initValue:",initValue);
    // Check value and pass it to the parents
    const handleOnBlur = async (doc = currentType) => {
        if (!isEdit) {
            return
        }
        let err = { isErr: false, msg: "" };
        if (doc.id === 0 && !allowNull) {
            err = { isErr: true, msg: "cannotEmpty" };
        } else if (isBackendTest) {
            err = await backendTestFunc(doc);
        }
        setErrInfo(err);
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };
    // Actions after the selected value changed
    const handleOnChange = (value) => {
        let newValue;
        if (value === null) {
            newValue = DataTypes[0];
        } else {
            newValue = value;
        }
        setCurrentType(newValue);
    };

    return (
        <>
            <InputLabel htmlFor={id} sx={{ color: allowNull ? "primary" : "blue" }}>{t(itemShowName)}</InputLabel>
            <Autocomplete
                id={id}
                options={DataTypes}
                disabled={!isEdit}
                disableClearable={true}
                getOptionLabel={(option) => t(option.name)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={key}
                            component="li"
                            {...optionProps}
                        >
                            <DataIcon datacode={option.id} fontSize="small" color="primary" sx={{ mr: 2 }} />
                            {t(option.name)}
                        </Box>
                    )
                }}
                noOptionsText={t("noData")}
                value={currentType}
                defaultValue={currentType}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />);
                }}
                onChange={(event, value) => handleOnChange(value)}
                onBlur={(event, value) => { handleOnBlur(value) }}
            >
            </Autocomplete >
        </>
    );
}

export default memo(ScDataTypeSelect);

