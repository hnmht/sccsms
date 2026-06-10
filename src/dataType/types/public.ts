import { Person } from "./person";

// Data query Params
export interface QueryParams {
    queryString: string;
}

// Data query pagination
export interface PagingQueryParams {
    queryString: string;
    page: number;
    perPage: number;
}

// Front Database information
export interface FrontDBInfo {
    id: number;
    dbID: string;
    frontDbID: string;
    cryptoKey: string;
    createDate: string;
    creator: Person;
    dr: 0 | 1;
    ts: string;
}
