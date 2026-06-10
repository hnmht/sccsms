import { VoucherFile } from "./voucherFile";
import { Person } from "./person";

// Execution Order Comment Message
export interface CommentMessage {
    id: number;
    hid: number;
    bid: number;
    rowNumber: number;
    billNumber: string;
    csaID: number;
    csaCode: string;
    csaName: string;
    epaID: number;
    epaCode: string;
    epaName: string;
    executionValueDisp: string;
    eoFiles: VoucherFile[];
    sendTo: Person;
    isRead: 0 | 1;
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