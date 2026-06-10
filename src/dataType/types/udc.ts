import { Person } from "./person";
// User Define Category
export interface UserDefineCategory {
    id: number;
    name: string;
    description: string;
    isLevel: 0 | 1;
    status: 0 | 1;
    createDate: string;
    creator: Person;
    modifier: Person;
    modifyDate: string;
    ts: string;
    dr: 0 | 1;
}
// User Define Category Front-end Cache
export interface UDCCache {
    queryTs: string;
    resultNumber: number;
    delItems: UserDefineCategory[];
    updateItems: UserDefineCategory[];
    newItems: UserDefineCategory[];
    resultTs: string;
}