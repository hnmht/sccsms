import { Person } from "./person";

// Positon
export interface Position {
    id: number;
    name: string;
    description: string;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    dr: 0 | 1;
    ts: string;
}
// Position Front-end Cache
export interface PositionCache {
    queryTs: string;
    resultNumber: number;
    delItems: Position[];
    updateItems: Position[];
    newItems: Position[];
    resultTs: string;
}