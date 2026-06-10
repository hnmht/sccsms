import { SimpEPC } from "./epc";
import { RiskLevel } from "./riskLevel";
import { Person } from "./person";
import { UserDefineCategory } from "./udc";
import { ScDataType, ScDataTypeList } from "./scDataType";

// Execution Project
export interface ExecutionProject {
    id: number;
    code: string;
    name: string;
    epc: SimpEPC;
    description: string;
    status: 0 | 1;
    resultType: ScDataType;
    udc: UserDefineCategory;
    defaultValue: any;
    defaultValueDisp: string;
    isCheckError: 0 | 1;
    errorValue: any;
    errorValueDisp: string;
    isRequireFile: 0 | 1;
    isOnSitePhoto: 0 | 1;
    riskLevel: RiskLevel;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts?: string;
    dr: 0 | 1;
}

// Execution Project Front-end Cache
export interface EPCache {
    queryTs: string;
    resultNumber: number;
    delItems: ExecutionProject[];
    updateItems: ExecutionProject[];
    newItems: ExecutionProject[];
    resultTs: string;
}

export function isEPALike(v: unknown): v is {
    id: number,
    defaultValue: any;
    defaultValueDisp: any;
    description: string;
    isCheckError: 0 | 1;
    errorValue: any;
    errorValueDisp: string;
    isRequireFile: 0 | 1;
    isOnSitePhoto: 0 | 1;
    riskLevel: RiskLevel;
} {
    return typeof v === "object" &&
        v !== null &&
        ("id" in v ||
            "defaultValue" in v ||
            "defaultValueDisp" in v ||
            "description" in v ||
            "isCheckError" in v ||
            "errorValue" in v ||
            "errorValueDisp" in v ||
            "isRequireFile" in v ||
            "isOnSitePhoto" in v ||
            "riskLevel" in v
        );
}