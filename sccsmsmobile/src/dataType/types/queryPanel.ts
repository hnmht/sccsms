import { InitialValueMap } from "./scInput";
import { ScDataTypeList } from "./scDataType";

export interface Comparison {
    id: string;
    label: string;
    value: string;
    applicable: ScDataTypeList[];
    needInput: boolean;
    addCharacter: boolean;
    addStart: string;
    addEnd: string;
}
export interface QueryField {
    id: number;
    value: string;
    label: string;
    inputType: ScDataTypeList;
    resultField: string;
}

export interface Condition {
    logic: "and" | "or";
    compare: Comparison;
    field: QueryField;
    value: InitialValueMap[keyof InitialValueMap] | null;
    isNecessary: boolean;
}