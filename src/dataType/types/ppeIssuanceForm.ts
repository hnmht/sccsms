import { SimpDept } from "./department";
import { VoucherFile } from "./voucherFile";
import { Person } from "./person";
import { PPE } from "./ppe";

// Personal Protective Equipment Issuance Form Row
export interface PPEIssuanceFormRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    recipient: Person;
    positionName: string;
    deptName: string;
    ppeCode: string;
    ppe: PPE;
    ppeModel: string;
    ppeUnit: string;
    quantity: number;
    description: string;
    status: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    files: VoucherFile[]; // BFiles
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Personal Protective Equipment Issuance Form Header
export interface PPEIssuanceForm {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    period: string;
    startDate: string;
    endDate: string;
    hFiles: VoucherFile[];
    body: PPEIssuanceFormRow[];
    sourceType: string; // DA: Direct Add WG: Wizard Generation
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
// PPE Issuance Form Wizard Params
export interface PPEIssuanceFormWizardParams {
    billDate: string;
    department: SimpDept;
    description: string;
    period: string;
    startDate: string;
    endDate: string;
    creator: Person;
    generationType: 0 | 1; // 0: Combined Generation 1: Separate Generation
}
// PPE Issuance Form Wizard
export interface PPEIssuanceFormWizard {
    params: PPEIssuanceFormWizardParams;
    recipients: Person[];
    vouchernumbers: string[];
}
// PPE Issuance Form Report
export interface PPEIssuanceFormReport {
    hid: number;
    bid: number;
    rowNumber: number;
    recipientID: number;
    recipientCode: string;
    recipientName: string;
    recipientPoisitionName: string;
    recipientDeptName: string;
    ppeID: number;
    ppeCode: string;
    ppeName: string;
    ppeModel: string;
    ppeUnit: string;
    quantity: number;
    bDescription: string;
    bStatus: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    billNumber: string;
    billDate: string;
    issuingDeptID: number;
    issuingDeptCode: string;
    issuingDeptName: string;
    hDescription: string;
    period: string;
    startDate: string;
    endDate: string;
    sourceType: string;
    hStatus: 0 | 1 | 2 | 3 | 4; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}