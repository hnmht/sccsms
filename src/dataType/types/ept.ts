import { Person } from "./person";
import { ExecutionProject } from "./epa";
import { RiskLevel } from "./riskLevel";

// Execution Project Template Row
export interface EPTRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    epa: ExecutionProject; // EP
    allowDelRow: 0 | 1;
    description: string;
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
    ts: string;
    dr: 0 | 1;
}
// Execution Project Template Header
export interface EPT {
    id: number; // HID
    code: string;
    name: string;
    description: string;
    status: 0 | 1;
    allowAddRow: 0 | 1;
    allowDelRow: 0 | 1;
    body: EPTRow[];
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Execution Project Template Front-end Cache
export interface EPTCache {
    queryTs: string;
    resultNumber: number;
    delItems: EPT[];
    updateItems: EPT[];
    newItems: EPT[];
    resultTs: string;
}