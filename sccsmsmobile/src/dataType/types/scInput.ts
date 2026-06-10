import { DimensionValue } from "react-native";
import { ConstructionSite } from "./csa";
import { SimpCSC } from "./csc";
import { SimpDC } from "./dc";
import { SimpDept } from "./department";
import { ExecutionProject } from "./epa";
import { SimpEPC } from "./epc";
import { EPT } from "./ept";
import { Person } from "./person";
import { Position } from "./postion";
import { PPE } from "./ppe";
import { RiskLevel } from "./riskLevel";
import { TC } from "./tc";
import { UserDefinedArchive } from "./uda";
import { UserDefineCategory } from "./udc";
import { ScFile } from "./file";
import { VoucherFile } from "./voucherFile";
import { ScDataTypeList } from "./scDataType";
import { TFunction } from "i18next";
import { MD3Theme } from "react-native-paper";

export interface MarkPosition {
    x: number;
    y: number;
}
export interface MarkText {
    position: MarkPosition;
    text: string;
    textSize: number;
    color: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface ErrMsg {
    isErr: boolean;
    msg: string;
}

export type InitialValueMap = {
    [ScDataTypeList.Text]: string;
    [ScDataTypeList.Number]: number;
    [ScDataTypeList.Password]: string;
    [ScDataTypeList.Mobile]: string;
    [ScDataTypeList.Email]: string;
    [ScDataTypeList.Date]: string;
    [ScDataTypeList.DateTime]: string;
    [ScDataTypeList.DateDisp]:string;
    [ScDataTypeList.DateTimeDisp]:string;

    [ScDataTypeList.Gender]: 0 | 1 | 2;
    [ScDataTypeList.SwitchYesOrNo]: 0 | 1;
    [ScDataTypeList.CheckYesOrNo]: 0 | 1;
    [ScDataTypeList.SelectYesOrNo]: 0 | 1 | 2;
    [ScDataTypeList.VoucherStatus]: 0 | 1 | 2 | 3 | 4 | 5;

    [ScDataTypeList.Person]: Person;
    [ScDataTypeList.SimpDept]: SimpDept;
    [ScDataTypeList.SimpCSC]: SimpCSC;
    [ScDataTypeList.UserDefineCategory]: UserDefineCategory;
    [ScDataTypeList.SimpEPC]: SimpEPC;
    [ScDataTypeList.UserDefinedArchive]: UserDefinedArchive;
    [ScDataTypeList.ExecutionProject]: ExecutionProject;
    [ScDataTypeList.ConstructionSite]: ConstructionSite;
    [ScDataTypeList.EPT]: EPT;
    [ScDataTypeList.RiskLevel]: RiskLevel;
    [ScDataTypeList.SimpDC]: SimpDC;
    [ScDataTypeList.Position]: Position;
    [ScDataTypeList.TC]: TC;
    [ScDataTypeList.PPE]: PPE;

    [ScDataTypeList.AvatarUpload]: ScFile;
    [ScDataTypeList.FileUpload]: VoucherFile[];
}

export interface BaseScInputProps {
    positionID: 0 | 1 | 2; // 0 Header  1 Body 2 Footer
    rowIndex: number;
    allowNull: boolean;
    isEdit: boolean;
    isBackendTest?: boolean;
    isMultiline?: boolean;
    textLines?: number;
    itemShowName?: string;
    itemKey: string;
    width?: DimensionValue;
    height?: DimensionValue;
    placeholder?: string;
    errInfo: ErrMsg;
    isOnSitePhoto?: boolean;
    markTexts?: MarkText[];
    color?: string;
    udc?: UserDefineCategory;
    onCancel?: () => void;
}

export type PickDone<T extends keyof InitialValueMap> = (
    value: InitialValueMap[T],
    itemKey: string,
    positionID: 0 | 1 | 2,
    rowIndex: number,
    errMsg: ErrMsg
) => void;

export type BackendTest<T extends keyof InitialValueMap> = (
    value: InitialValueMap[T]
) => ErrMsg | Promise<ErrMsg>;

export type ScInputProps<T extends keyof InitialValueMap> = BaseScInputProps & {
    dataType: T;
    initValue: InitialValueMap[T];
    pickDone: PickDone<T>,
    backendTest?: BackendTest<T>
}

export type ScInputUnionProps = {
    [K in keyof InitialValueMap]: ScInputProps<K>
}[keyof InitialValueMap];

export type ScDetailProps<T extends keyof InitialValueMap> = {
    visible: boolean;
    currentItem: InitialValueMap[T];
    backAction: () => void;
    t: TFunction;
    theme: MD3Theme;
}

export type ScPickerProps<T extends keyof InitialValueMap> = {
    pressItemAction: (item: InitialValueMap[T]) => void;
    cancelAction: () => void;
    currentItem: InitialValueMap[T];
    t: TFunction;
    theme: MD3Theme;
}

