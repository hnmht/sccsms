import { Person } from "./person";

// Simple Document Category
export interface SimpDC {
    id: number;
    name: string;
    description: string;
    fatherID: number;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Document Category
export interface DC {
    id: number;
    name: string;
    description: string;
    fatherID: SimpDC;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Simple Document Category Front-end Cache
export interface SimpDCCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpDC[];
    updateItems: SimpDC[];
    newItems: SimpDC[];
    resultTs: string;
}