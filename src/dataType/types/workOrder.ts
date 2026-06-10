import { SimpDept } from "./department";
import { Person } from "./person";
import { ConstructionSite } from "./csa";
import { EPT } from "./ept";
import { ErrMsg } from "./scInput";
// Work Order Row Errors
export interface WORowErrors {
    csa: ErrMsg;
    executor: ErrMsg;
    ept: ErrMsg;
    startTime: ErrMsg;
    endTime: ErrMsg;
}
// Work Order Row
export interface WorkOrderRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    csa: ConstructionSite;
    executor: Person;
    description: string;
    ept: EPT;
    startTime: string;
    endTime: string;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    eoID: number;
    eoNumber: string;
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
    // Header fields duplicated in row for convenience:
    billNumber: string;
    billDate: string;
    department: SimpDept;
    headerDescription: string; // HDescription
    workDate: string;
}

// Work Order Errors
export interface WOErrors {
    billDate: ErrMsg;
    workDate: ErrMsg;
    body: WORowErrors[];
    isErr?: boolean;
    isHeaderErr?: boolean;
    isBodyErr?: boolean;
}

// Work Order Header
export interface WorkOrder {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    workDate: string;
    body: WorkOrderRow[];
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
    errData?: WOErrors;
}