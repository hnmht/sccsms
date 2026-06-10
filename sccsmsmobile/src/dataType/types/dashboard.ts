import { RiskLevel } from "./riskLevel";
// Give Work Order Count
export interface GiveWO {
    freeCount: number;
    confirmedCount: number;
    executingCount: number;
    completedCount: number;
}
// Recive Work Order Count
export interface ReciveWO {
    count: number;
    unFinishedCount: number;
}

// Discovered Issue Count
export interface DiscoveredIssue {
    count: number;
    finished: number;
}
// Process the Issue
export interface ProcessIssue {
    completedCount: number;
    unFinishedCount: number;
}

// Issue Item detail
export interface IssueItem {
    eoBID: number;
    epaID: number;
    epaCode: string;
    epaName: string;
    epcID: number;
    epcName: string;
    csaID: number;
    csaCode: string;
    csaName: string;
    cscID: number;
    cscName: string;
    respID: number;
    respCode: string;
    respName: string;
    rlID: number;
    rlName: string;
    rlColor: string;
    isRectify: 0 | 1;
    isFinish: 0 | 1;
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}
// User Reviewed of the execution Order Record
export interface ReviewedEORecord {
    id: number;
    hid: number;
    billNumber: string;
    startTime: string;
    endTime: string;
    consumeSeconds: number;
    csaID: number;
    csaCode: string;
    csaName: string;
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}

// User's Execution Order Reviewed by other user record
export interface BeReviewedItem {
    id: number;
    hid: number;
    billNumber: string;
    startTime: string;
    endTime: string;
    consumeSeconds: number;
    csaID: number;
    csaCode: string;
    csaName: string;
    reviewerID: number;
    reviewerCode: string;
    reviewerName: string;
}

// Dashboard data 
export interface DashBoardData {
    startDate: string;
    endDate: string;
    giveWo: GiveWO;
    reciveWo: ReciveWO;
    discoveredIssue: DiscoveredIssue;
    processIssue: ProcessIssue;
    issueItems: IssueItem[];
    reviewedItems: ReviewedEORecord[];
    beReviewedItems: BeReviewedItem[];
}

// Risk Count
export interface RiskCount {
    occYear: string;
    occMonth: string;
    occWeek: string;
    occDay: string;
    riskLevel: RiskLevel;
    totalNumber: number;
}

// Risk Trend Data
export interface RiskTrendData {
    startDate: string;
    endDate: string;
    riskTrends: RiskCount[];
}

// Date Interval
export interface DateInterval {
    id:string;
    label:string;
    startDate:string;
    endDate:string;
}