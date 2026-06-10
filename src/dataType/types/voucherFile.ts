import { Person } from "./person";
import { ScFile } from "./file";
// Voucher ScFile
export interface VoucherFile {
    id: number;
    billBID: number;
    billHID: number;
    file: ScFile;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts?: string;
    dr: 0 | 1;
}