import { Person } from "./person";

// Simple Construction Site Category
export interface SimpCSC {
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
// Construction Site Category
export interface CSC {
    id: number;
    name: string;
    description: string;
    fatherID: SimpCSC;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Simple Construction Site Category Front-end cache
export interface SimpCSCCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpCSC[];
    updateItems: SimpCSC[];
    newItems: SimpCSC[];
    resultTs: string;
}