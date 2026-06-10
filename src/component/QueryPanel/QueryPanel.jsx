import { useState, useCallback, useEffect, memo } from "react";
import { Grid, DialogContent, Tooltip, IconButton, DialogTitle, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AddIcon, DeleteIcon } from "../PubIcon/PubIcon";
import { cloneDeep } from "lodash";

import { Divider } from "../ScMui/ScMui";
import ScInput from "../ScInput";
import LogicSelect from "./LogicSelect";
import ComparisonsSelect from "./ComparisonsSelect";
import FieldSelect from "./FieldSelect";
import { GetDataTypeDefaultValue } from "../../storage/dataTypes";
import { Comparisons } from "./constructor";

// Generate the default query condition values
const getDefaultCondition = (queryFields) => {
    let condition = {
        logic: "and",
        field: queryFields[0],
        compare: { id: "equal", label: 'equal', value: '=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
        value: GetDataTypeDefaultValue(queryFields[0].inputType),
        isNecessary: false
    };
    return condition;
};
// Generate the errors value
const generateErrors = (rowNumber) => {
    let errors = [];
    for (let i = 0; i < rowNumber; i++) {
        errors.push({});
    }
    return errors;
};
// Check errors
const checkErrors = (errors) => {
    let number = 0;
    errors.forEach((row) => {
        for (let key in row) {
            if (row[key].isErr) {
                number = number + 1;
            }
        }
    });
    return number > 0;
};

// Query Condifiton Panel
const QueryPanel = ({ title = "queryConditions", queryFields, initalConditions, onOk, onCancel }) => {
    const [conditons, setConditons] = useState([]);
    const [errors, setErrors] = useState(() => generateErrors(initalConditions ? initalConditions.length : 0));
    const { t } = useTranslation();

    useEffect(() => {
        setConditons(initalConditions);
    }, [initalConditions]);
    // Process the data received from the child component
    const handleGetValue = useCallback((value, itemKey, positionID, rowIndex, errMsg) => {
        // Change the input value        
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);
            // If the value being passed is the field value,
            // then further processing is required
            if (itemKey === "field") {
                let oldCompareId = newConditions[rowIndex].compare.id;
                // Determine the return value type
                const currentComps = Comparisons.filter((item) => item.applicable.includes(value.resultType));
                const inComps = currentComps.some((item) => item.id === oldCompareId);
                if (!inComps) {
                    newConditions[rowIndex].compare = currentComps[0];
                }
                // Modify the Input thpe
                newConditions[rowIndex].value = GetDataTypeDefaultValue(value.inputType);
            }
            newConditions[rowIndex][itemKey] = value;

            return newConditions;
        });
        // Change the errors value
        setErrors((prevState) => {
            let newErrors = cloneDeep(prevState);
            newErrors[rowIndex].value = errMsg;
            return newErrors;
        });
    }, []);

    // Actions after click the Add field button
    const handleAddCondition = () => {
        // Add new field    
        const newConditions = cloneDeep(conditons);
        newConditions.push(getDefaultCondition(queryFields));
        // Add error to errors
        let newErrors = cloneDeep(errors);
        newErrors.push({});
        // Refresh
        setConditons(newConditions);
        setErrors(newErrors);
    };

    // Actions after click the delete button
    const handleDeleteCondition = (index) => {
        const newConditions = cloneDeep(conditons);
        newConditions.splice(index, 1);
        // Delete error value
        let newErrors = cloneDeep(errors);
        newErrors.splice(index, 1);
        // Refresh
        setConditons(newConditions);
        setErrors(newErrors);
    };

    // Actions after click the Ok button
    const handleOk = () => {
        onOk(conditons);
    };

    return (
        <>
            <DialogTitle
                sx={{ height: 48, pb: 4, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", px: 4 }}
            >
                {t(title)}
                <Tooltip title={t("addQueryField")} placement="top">
                    <IconButton onClick={handleAddCondition}>
                        <AddIcon color="primary" fontSize="large" />
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ height: 512, overflow: "auto" }}>
                {conditons.map((condition, index) => {
                    return <Grid container spacing={2} key={index} paddingTop={2}>
                        <Grid item xs={1.5}>
                            {index !== 0
                                ? <LogicSelect
                                    itemShowName="logic"
                                    itemKey="logic"
                                    rowIndex={index}
                                    pickDone={handleGetValue}
                                    isEdit={!condition.isNecessary}
                                />
                                : null
                            }
                        </Grid>
                        <Grid item xs={2.5}>
                            <FieldSelect
                                itemShowName="field"
                                itemKey="field"
                                rowIndex={index}
                                pickDone={handleGetValue}
                                fields={queryFields}
                                selected={condition.field.id}
                                isEdit={!condition.isNecessary}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <ComparisonsSelect
                                itemShowName="comparisonOperator"
                                itemKey="compare"
                                rowIndex={index}
                                pickDone={handleGetValue}
                                dataType={condition.field.resultType}
                                selected={condition.compare.id}
                                isEdit={!condition.isNecessary}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            {condition.compare.needInput
                                ? <ScInput
                                    dataType={condition.field.inputType}
                                    pickDone={handleGetValue}
                                    initValue={condition.value}
                                    rowIndex={index}
                                    itemKey="value"
                                    isEdit={true}
                                    allowNull={false}
                                    udc={condition.field.inputType === 550 ? condition.field.udc : { id: 0, code: '', name: "" }}
                                />
                                : null
                            }
                        </Grid>
                        <Grid item xs={1} sx={{ display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <Tooltip title={t("delete")} placement="top">
                                <span>
                                    <IconButton disabled={condition.isNecessary} onClick={() => handleDeleteCondition(index)}>
                                        <DeleteIcon color={condition.isNecessary ? "default" : "error"} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Grid>
                    </Grid>
                })}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ m: 1 }}>
                <Button color="error" onClick={onCancel} >{t("cancel")}</Button>
                <Button variant="contained" disabled={checkErrors(errors)} onClick={handleOk}>{t("ok")}</Button>
            </DialogActions>
        </>
    );
};

export default memo(QueryPanel);

