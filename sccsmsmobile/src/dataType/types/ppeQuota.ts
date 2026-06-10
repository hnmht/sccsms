import { Position } from "./postion";
import { Person } from "./person";
import { PPE } from "./ppe";
// Personal Protective Equipment Quota Row
export interface PPEQuotaRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    ppe: PPE;
    quantity: number;
    description: string;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Personal Perotective Equipment Quota
export interface PPEQuota {
    id: number; // HID
    billDate: string;
    position: Position;
    period: string;
    description: string;
    body: PPEQuotaRow[];
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// PPE Position's Personal Protective Equipment Quota Params
export interface PPEPositionsParams {
    period: string;
    positions: Position[];
}