import { Person } from "./person";

export interface SimpDept {
    id: number;
    code: string;
    name: string;
    fatherID: number;
    leader: Person;
    description: string;
    status: 0 | 1;
    createDate: string;
    ts: string;
    dr: 0 | 1;
}

export interface Department {
    id: number;
    code: string;
    name: string;
    fatherID: SimpDept;
    leader: Person;
    description: string;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifier: Person;
    modifyDate: string;
    ts: string;
    dr: 0 | 1;
}

export interface SimpDeptCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpDept[];
    updateItems: SimpDept[];
    newItems: SimpDept[];
    resultTs: string;
}