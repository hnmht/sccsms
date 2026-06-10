import { Person } from "./person";
// Personal Protective Equipment
export interface PPE {
    id: number;
    code: string;
    name: string;
    model: string;
    unit: string;
    status: 0 | 1;
    description: string;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Personal Protective Equipment Front-end cache
export interface PPECache {
    queryTs: string;
    resultNumber: number;
    delItems: PPE[];
    updateItems: PPE[];
    newItems: PPE[];
    resultTs: string;
}