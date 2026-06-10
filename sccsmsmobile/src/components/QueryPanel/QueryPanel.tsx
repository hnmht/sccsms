import { useState, memo, useEffect, useCallback, useMemo,useRef } from "react";
import { View, ScrollView } from "react-native";
import { Text, Divider, useTheme, Surface, IconButton, Portal, Button } from "react-native-paper";
import { cloneDeep } from "lodash";

import { useAppSelector } from "../../store/hooks";
import ScInput from "../ScInput";
import LogicSelect from "./LogicSelect";
import ComparisonsSelect from "./ComparisonsSelect";
import FieldSelect from "./FieldSelect";
import { getEmptyByType } from "../../dataType/dataZero/pubic";
import { checkConditionsErrors, checkErrors } from "./constructor";
import { Comparisons, equal } from "../../dataType/dataZero/queryPanel";
import { Condition, QueryField, Comparison } from "../../dataType/types/queryPanel";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { useTranslation } from "react-i18next";
import { getEmptyUDC } from "../../dataType/dataZero/udc";
import { UserDefinedArchive } from "../../dataType/types/uda";

interface QueryPanelProps {
    title: string;
    queryFields: QueryField[];
    initalConditions: Condition[];
    onOk: (conditions: Condition[]) => void;
    onCancel: () => void;
}

// Get Initial search criteria
const getDefaultCondition = (queryFields: QueryField[]) => {
    let condition: Condition = {
        logic: "and",
        field: queryFields[0],
        compare: equal,
        value: getEmptyByType(queryFields[0].inputType),
        isNecessary: false
    };
    return condition;
};

const QueryPanel = ({ title = "queryConditions", queryFields, initalConditions, onOk, onCancel }: QueryPanelProps) => {
    const [conditons, setConditons] = useState<Condition[]>([]);
    const theme = useTheme();
    const errors = useMemo(() => checkConditionsErrors(conditons), [conditons]);
    const hasErr = useMemo(() => checkErrors(errors), [conditons]);
    const { t } = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);
    useEffect(() => {
        setConditons(initalConditions);
    }, [initalConditions]);

    // Button Position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    // Actions after get ScInput 
    const handleGetValue = useCallback((value: InitialValueMap[keyof InitialValueMap], itemKey: string, positionID: 0 | 1 | 2, rowIndex: number, errMsg: ErrMsg) => {
        // Update conditions        
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);
            newConditions[rowIndex].value = value;
            return newConditions;
        });
    }, []);

    // Actions after Logic Component passed value
    const handleGetLogic = useCallback((value: "and" | "or", rowIndex: number, errMsg: ErrMsg) => {
        // Update Conditions
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);
            newConditions[rowIndex].logic = value;
            return newConditions;
        })
    }, []);

    // Actions after Field Component passed value
    const handleGetField = useCallback((value: QueryField, rowIndex: number, errMsg: ErrMsg) => {
        // Update Conditions
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);
            let oldCompareId = newConditions[rowIndex].compare.id;
            // change Comprison
            const currentComps = Comparisons.filter((item) => item.applicable.includes(value.inputType));
            const inComps = currentComps.some((item) => item.id === oldCompareId);
            if (!inComps) {
                newConditions[rowIndex].compare = currentComps[0];
            }
            // Change value
            newConditions[rowIndex].value = getEmptyByType(value.inputType);
            newConditions[rowIndex].field = value;
            return newConditions;
        })
    }, []);

    // Actions after Compare Component passed value
    const handleGetCompare = useCallback((value: Comparison, rowIndex: number, errMsg: ErrMsg) => {
        // Update Conditions
        setConditons((prevState) => {
            let newConditions = cloneDeep(prevState);
            newConditions[rowIndex].compare = value;
            return newConditions;
        })
    }, []);
    // Add Condition row
    const handleAddCondition = () => {
        const newConditions = cloneDeep(conditons);
        newConditions.push(getDefaultCondition(queryFields));
        setConditons(newConditions);
    };
    // Delete condition row
    const handleDeleteCondition = (index: number) => {
        const newConditions = cloneDeep(conditons);
        newConditions.splice(index, 1);
        setConditons(newConditions);

    };
    // Actions after ok button
    const handleOk = () => {
        onOk(conditons);
    };

    return (
        <View style={{ flex: 1 }}>
            <Portal.Host>
                <View style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 40,
                    width: "100%",
                    backgroundColor: theme.colors.background
                }}>
                    <Surface style={{ padding: 4, minHeight: 40, width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text variant="titleMedium">{t(title)}</Text>
                    </Surface>
                </View>
                <Divider />
                <View style={{
                    flex: 1,
                    backgroundColor: theme.colors.background
                }}>
                    <ScrollView
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {conditons.map((condition, index) => {
                            return <Surface key={index} style={{ width: "100%", flexDirection: "row", flexWrap: "wrap", alignItems: "center", margin: 8, padding: 4 }}>
                                {index !== 0
                                    ? <View style={{ width: "100%", height: 64 }}>
                                        <LogicSelect
                                            itemShowName={t("logic")}
                                            rowIndex={index}
                                            pickDone={handleGetLogic}
                                            isEdit={!condition.isNecessary}
                                        />
                                    </View>
                                    : null
                                }

                                <View style={{ width: "100%", height: 64 }}>
                                    <FieldSelect
                                        itemShowName={t("field")}
                                        rowIndex={index}
                                        pickDone={handleGetField}
                                        fields={queryFields}
                                        selected={condition.field}
                                        isEdit={!condition.isNecessary}
                                    />
                                </View>
                                <View style={{ width: "100%", height: 64, padding: 0, margin: 0 }}>
                                    <ComparisonsSelect
                                        itemShowName={t("compare")}
                                        rowIndex={index}
                                        pickDone={handleGetCompare}
                                        dataType={condition.field.inputType}
                                        selected={condition.compare}
                                        isEdit={!condition.isNecessary}
                                    />
                                </View>
                                <View style={{ width: "100%", height: 64 }}>
                                    {condition.compare.needInput
                                        ? <ScInput
                                            dataType={condition.field.inputType as any}
                                            positionID={0}
                                            errInfo={errors[index]}
                                            itemShowName={t(condition.field.label)}
                                            pickDone={handleGetValue}
                                            initValue={condition.value ?? getEmptyByType(condition.field.inputType)}
                                            rowIndex={index}
                                            itemKey="value"
                                            isEdit={true}
                                            allowNull={false}
                                            udc={condition.field.inputType === ScDataTypeList.UserDefinedArchive ? (condition.value as UserDefinedArchive).udc : getEmptyUDC()}
                                        />
                                        : null
                                    }
                                </View>
                                <View style={{ width: "100%", height: 40, flexDirection: "row", alignItems: "center", justifyContent: "flex-end", margin: 0, padding: 0 }}>
                                    <IconButton
                                        icon="delete"
                                        disabled={condition.isNecessary}
                                        iconColor={theme.colors.primary}
                                        onPress={() => handleDeleteCondition(index)}
                                    />
                                </View>
                            </Surface>
                        })}
                    </ScrollView>
                </View>
                <Surface style={{ minHeight: 60, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center", padding: 2, backgroundColor: theme.colors.background }}>
                    <Button mode="text" onPress={onCancel} textColor={theme.colors.error} style={{ margin: 4 }}>{t("cancel")}</Button>
                    <Button icon="plus" onPress={handleAddCondition} style={{ margin: 4 }}>{t("add")}</Button>
                    <Button icon="check" mode="contained" disabled={hasErr} onPress={handleOk} style={{ margin: 4 }}>{t("ok")}</Button>
                </Surface>
            </Portal.Host>
        </View>
    );
};

export default memo(QueryPanel);