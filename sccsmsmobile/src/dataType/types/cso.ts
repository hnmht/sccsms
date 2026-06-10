import { UserDefineCategory } from "./udc";
import { UserDefinedArchive } from "./uda";
import { Person } from "./person";
// Construction Site Options
export interface ConstructionSiteOption {
    id: number;
    code: string;
    name: string;
    displayName: string;
    udc: UserDefineCategory;
    defaultValue: UserDefinedArchive;
    enable: 0 | 1;
    isModify: 0 | 1;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}
// Construction Site Option Front-end Cache
export interface ConstructionSiteOptionCache {
    queryTs: string;
    resultNumber: number;
    delItems: ConstructionSiteOption[];
    updateItems: ConstructionSiteOption[];
    newItems: ConstructionSiteOption[];
    resultTs: string;
}