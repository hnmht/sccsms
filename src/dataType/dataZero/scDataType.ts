import { ScDataType, ScDataTypeList } from "../types/scDataType";

export function getDefaultDataType(): ScDataType {
    const dataType: ScDataType = {
        id: ScDataTypeList.Text,
        code: "ScTextInput",
        name: "text",
        dataType: "string",
        frontDb: "",
        inputMode: "Input"
    }
    return dataType;
}