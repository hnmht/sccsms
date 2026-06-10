import { Comparison } from "../types/queryPanel";
import { ScDataTypeList } from "../types/scDataType";

export const allCompareTypes: ScDataTypeList[] = [
    ScDataTypeList.Text,
    ScDataTypeList.Number,
    ScDataTypeList.Password,
    ScDataTypeList.Mobile,
    ScDataTypeList.Email,
    ScDataTypeList.Date,
    ScDataTypeList.DateTime,
    ScDataTypeList.Gender,
    ScDataTypeList.SwitchYesOrNo,
    ScDataTypeList.CheckYesOrNo,
    ScDataTypeList.SelectYesOrNo,
    ScDataTypeList.Person,
    ScDataTypeList.SimpDept,
    ScDataTypeList.SimpCSC,
    ScDataTypeList.UserDefineCategory,
    ScDataTypeList.SimpEPC,
    ScDataTypeList.UserDefinedArchive,
    ScDataTypeList.ExecutionProject,
    ScDataTypeList.ConstructionSite,
    ScDataTypeList.EPT,
    ScDataTypeList.RiskLevel,
    ScDataTypeList.SimpDC,
    ScDataTypeList.Position,
    ScDataTypeList.TC,
    ScDataTypeList.PPE,
    ScDataTypeList.AvatarUpload,
    ScDataTypeList.FileUpload,
    ScDataTypeList.VoucherStatus
];

export const containComparisonTypes: ScDataTypeList[] =[
    ScDataTypeList.Text
];

export const nullComparisonTypes: ScDataTypeList[] = [
    ScDataTypeList.Text,
    ScDataTypeList.Number,
    ScDataTypeList.Password,
    ScDataTypeList.Mobile,
    ScDataTypeList.Email,
    ScDataTypeList.Gender,
    ScDataTypeList.Person,
    ScDataTypeList.SimpDept,
    ScDataTypeList.SimpCSC,
    ScDataTypeList.UserDefineCategory,
    ScDataTypeList.SimpEPC,
    ScDataTypeList.UserDefinedArchive,
    ScDataTypeList.ExecutionProject,
    ScDataTypeList.ConstructionSite,
    ScDataTypeList.EPT,
    ScDataTypeList.RiskLevel,
    ScDataTypeList.SimpDC,
    ScDataTypeList.Position,
    ScDataTypeList.TC,
    ScDataTypeList.PPE,
    ScDataTypeList.AvatarUpload,
    ScDataTypeList.FileUpload,
    ScDataTypeList.VoucherStatus
];

export const equal: Comparison = {
    id: "equal",
    label: 'equal',
    value: '=',
    needInput: true,
    addCharacter: false,
    addStart: "",
    addEnd: "",
    applicable: allCompareTypes
};

export const notEqual: Comparison = {
    id: "notequal",
    label: 'notEqual',
    value: '!=',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: true,
    applicable: allCompareTypes
};

export const lessThan: Comparison = {
    id: "lessthan",
    label: 'lessThan',
    value: '<',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: true,
    applicable: allCompareTypes
};

export const greaterThan: Comparison = {
    id: "greaterthan",
    label: 'greaterThan',
    value: '>',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: true,
    applicable: allCompareTypes
};

export const lessThanEqual: Comparison = {
    id: "lessthanequal",
    label: 'lessThanEqual',
    value: '<=',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: true,
    applicable: allCompareTypes
};
export const greaterThanEqual: Comparison = {
    id: "greaterthanequal",
    label: 'greaterThanEqual',
    value: '>=',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: true,
    applicable: allCompareTypes
};
export const contain: Comparison = {
    id: "contain",
    label: 'contain',
    value: 'ilike',
    addCharacter: true,
    addStart: "%",
    addEnd: "%",
    needInput: true,
    applicable: containComparisonTypes
};
export const notContain: Comparison = {
    id: "notcontain",
    label: 'notContain',
    value: 'not ilike',
    addCharacter: true,
    addStart: "%",
    addEnd: "%",
    needInput: true,
    applicable: containComparisonTypes
};
export const cmpNull:Comparison = {
    id: "null",
    label: 'null',
    value: 'is null',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: false,
    applicable: nullComparisonTypes
};
export const cmpNotNull:Comparison = {
    id: "notnull",
    label: 'notNull',
    value: 'is not null',
    addCharacter: false,
    addStart: "",
    addEnd: "",
    needInput: false,
    applicable: nullComparisonTypes
};
export const Comparisons: Comparison[] = [
    equal,
    notEqual,
    lessThan,
    greaterThan,
    lessThanEqual,
    greaterThanEqual,
    contain,
    notContain,
    cmpNull,
    cmpNotNull
];