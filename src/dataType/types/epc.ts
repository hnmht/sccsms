import { Person } from "./person";

// Simple Execution Project Category
export interface SimpEPC {
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

// Execution Project Category
export interface EPC {
    id: number;
    name: string;
    description: string;
    fatherID: SimpEPC;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Execution Project Category Front-end Cache
export interface SimpEPCCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpEPC[];
    updateItems: SimpEPC[];
    newItems: SimpEPC[];
    resultTs: string;
}