import { VoucherFile } from "./voucherFile";
import { Person } from "./person";

// Training Course Master Data
export interface TC {
    id: number;
    code: string;
    name: string;
    classHour: number;
    isExamine: number;
    description: string;
    status: 0 | 1;
    files: VoucherFile[];
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Training Course Front-end Cache
export interface TCCache {
    queryTs: string;
    resultNumber: number;
    delItems: TC[];
    updateItems: TC[];
    newItems: TC[];
    resultTs: string;
}