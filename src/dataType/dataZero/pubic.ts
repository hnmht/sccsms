import { ScDataType, ScDataTypeList } from "../types/scDataType";
import { dayjs } from "../../i18n/i18n";
import { InitialValueMap } from "../types/scInput";
import { getEmptyCSA } from "./csa";
import { getEmptyCSC } from "./csc";
import { getEmptyCSO } from "./cso";
import { getEmptySimpDC } from "./dc";
import { getEmptyDepartment, getEmptySimpDept } from "./department";
import { getEmptyEP } from "./epa";
import { getEmptySimpEPC } from "./epc";
import { getEmptyEPT } from "./ept";
import { getEmptyPerson } from "./person";
import { getEmptyPosition } from "./position";
import { getEmptyPPE } from "./ppe";
import { getEmptyRiskLevel } from "./riskLevel";
import { getEmptyTC } from "./tc";
import { getEmptyUDC } from "./udc";
import { getEmptyFile } from "./file";

export function getEmptyQueryParams<T>(ts: string): T {
    const emptyParam = {
        queryTs: ts,
        resultNumber: 0,
        delItems: [],
        updateItems: [],
        newItems: [],
        resultTs: ts
    } as T;
    return emptyParam;
}

export function getEmptyByType(dataType: ScDataTypeList): InitialValueMap[keyof InitialValueMap] {
    switch (dataType) {
        case ScDataTypeList.Text:
            return "";
        case ScDataTypeList.Number:
            return 0;
        case ScDataTypeList.Password:
            return "";
        case ScDataTypeList.Mobile:
            return "";
        case ScDataTypeList.Email:
            return "";
        case ScDataTypeList.Date:            
        case ScDataTypeList.DateTime:
            return new Date(); 
        case ScDataTypeList.Gender:
            return 0;
        case ScDataTypeList.SwitchYesOrNo:
            return 0;
        case ScDataTypeList.CheckYesOrNo:
            return 0;
        case ScDataTypeList.SelectYesOrNo:
            return 0;
        case ScDataTypeList.VoucherStatus:
            return 0;
    
        case ScDataTypeList.SimpDept:
            return getEmptySimpDept();
        case ScDataTypeList.ExecutionProject:
            return getEmptyEP();
        case ScDataTypeList.SimpEPC:
            return getEmptySimpEPC();
        case ScDataTypeList.EPT:
            return getEmptyEPT();
        case ScDataTypeList.Person:
            return getEmptyPerson();
        case ScDataTypeList.ConstructionSite:
            return getEmptyCSA();
        case ScDataTypeList.SimpCSC:
            return getEmptyCSC();
        case ScDataTypeList.UserDefineCategory:
            return getEmptyUDC();
        case ScDataTypeList.RiskLevel:
            return getEmptyRiskLevel();
        case ScDataTypeList.SimpDC:
            return getEmptySimpDC();
        case ScDataTypeList.Position:
            return getEmptyPosition();
        case ScDataTypeList.TC:
            return getEmptyTC();
        case ScDataTypeList.PPE:
            return getEmptyPPE();            
        case ScDataTypeList.AvatarUpload:
            return getEmptyFile();
        default:
            throw new Error("Failed ScDataType");
    }
}
