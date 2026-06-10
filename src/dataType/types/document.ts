import { SimpDC } from "./dc";
import { Person } from "./person";
import { VoucherFile } from "./voucherFile";

// Document
export interface Document {
    id: number;
    dc: SimpDC;
    name: string;
    edition: string;
    author: string;
    uploadDate: string;
    releaseDate: string;
    tags: string;
    description: string;
    files: VoucherFile[];
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Document Query pagination parameters by category
export interface DCPagingParams {
    dc: SimpDC;
    count: number;
    page: number;
    perPage: number;
    docs: Document[];
}

// Document Report
export interface QueryDocument {
    docID: number;
    docName: string;
    dcID: number;
    dcName: string;
    edition: string;
    author: string;
    uploadDate: string;
    releaseDate: string;
    description: string;
    files: VoucherFile[];
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}