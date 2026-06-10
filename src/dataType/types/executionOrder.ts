import { SimpDept } from "./department";
import { ConstructionSite } from "./csa";
import { Person } from "./person";
import { EPT } from "./ept";
import { ExecutionProject } from "./epa";
import { VoucherFile } from "./voucherFile";
import { RiskLevel } from "./riskLevel";
import { ErrMsg } from "./scInput";
// Execution Order Row Errors
export interface EORowErrors {
    epa: ErrMsg;
    executionValue: ErrMsg;
    riskLevel:ErrMsg;
    files: ErrMsg;
    issueOwner: ErrMsg;
    handleStartTime: ErrMsg;
    handleEndTime: ErrMsg;
}
// Execution Order Row
export interface ExecutionOrderRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    epa: ExecutionProject;
    allowDelRow: 0 | 1;
    executionValue: any;
    executionValueDisp: string;
    files: VoucherFile[];
    description: string;
    epaDescription: string;
    isCheckError: 0 | 1;
    errorValue: any;
    errorValueDisp: string;
    isRequireFile: 0 | 1;
    isOnSitePhoto: 0 | 1;
    isIssue: 0 | 1;
    isRectify: 0 | 1;
    isHandle: 0 | 1;
    issueOwner: Person;
    handleStartTime: string;
    handleEndTime: string;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    isFromEpt: 0 | 1;
    isFinish: 0 | 1;
    irfID: number;
    irfNumber: string;
    riskLevel: RiskLevel;
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts?: string;
    dr: 0 | 1;
}

// Execution Order Errors
export interface EOErrors {
    billDate: ErrMsg;
    department: ErrMsg;
    csa: ErrMsg;
    executor: ErrMsg;
    ept: ErrMsg;
    startTime: ErrMsg;
    endTime: ErrMsg;
    body: EORowErrors[];
    isErr?: boolean;
    isHeaderErr?: boolean;
    isBodyErr?: boolean;
}

// Execution Order Header
export interface ExecutionOrder {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    sourceType: string;
    sourceBillNumber: string;
    sourceHID: number;
    sourceRowNumber: number;
    sourceBID: number;
    sourceRowTs: string;
    startTime: string;
    endTime: string;
    csa: ConstructionSite;
    executor: Person;
    ept: EPT;
    allowAddRow: 0 | 1;
    allowDelRow: 0 | 1;
    body: ExecutionOrderRow[];
    issueNumber: number;
    reviewedNumber: number;
    reviewedSeconds: number;
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts?: string;
    dr: 0 | 1;
    errData?:EOErrors;
}

// Execution Order Record for Reference by Downstreams Voucher
export interface ReferExecutionOrder {
    id: number; // BID
    hid: number;
    rowNumber: number;
    epa: ExecutionProject;
    executionValue: string;
    executionValueDisp: string;
    description: string;
    eoFiles: VoucherFile[];
    isHandle: number;
    issueOwner: Person;
    handleStartTime: string;
    handleEndTime: string;
    status: 0 | 1;
    riskLevel: RiskLevel;
    dr: 0 | 1;
    ts: string;
    isFinish: number;
    billNumber: string;
    billDate: string;
    department: SimpDept;
    csa: ConstructionSite;
    executor: Person;
}
// Execution Order Comment Record 
export interface EOCommentRecord {
    id: number;
    hid: number;
    bid: number;
    rowNumber: number;
    billNumber: string;
    sendTo: Person;
    isRead: number;
    readTime: string;
    content: string;
    sendTime: string;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Execution Order Review Record 
export interface EOReviewedRecord {
    id: number;
    hid: number;
    billNumber: string;
    startTime: string;
    endTime: string;
    consumeSeconds: number;
    createDate: string;
    creator: Person;
    ts?: string;
    dr?: 0 | 1;
}

// Execution Order Comments Params
export interface EOCommentsParams {
    hid: number;
    comments: EOCommentRecord[];
}

// Execution Order Reviews Params
export interface EOReviewsParams {
    hid: number;
    reviews: EOReviewedRecord[];
}
// Execution Order List Params 
export interface EOListPaging {
    eos: ExecutionOrder[];
    count: number;
    page: number;
    perPage: number;
}