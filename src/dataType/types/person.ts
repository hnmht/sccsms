import { ScFile } from "./file";

export interface Person {
    id: number;
    code: string;
    name: string;
    avatar: ScFile;
    deptID: number;
    deptCode: string;
    deptName: string;
    isOperator: 0 | 1;
    positionID: number;
    positionName: string;
    description: string;
    mobile: string;
    email: string;
    gender: 0 | 1 | 2;
    systemFlag: 0 | 1;
    status: 0 | 1;
    createDate: string;
    ts: string;
    dr: 0 | 1;
}

// Person Front-end Cache
export interface PersonCache {
    queryTs: string;
    resultNumber: number;
    delItems: Person[];
    updateItems: Person[];
    newItems: Person[];
    resultTs: string;
}