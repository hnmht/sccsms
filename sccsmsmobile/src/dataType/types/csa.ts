import { SimpDept } from "./department";
import { Person } from "./person";
import { SimpCSC } from "./csc";
import { UserDefinedArchive } from "./uda";

// Construction Site Archive
export interface ConstructionSite {
    id: number;
    code: string;
    name: string;
    description: string;
    csc: SimpCSC;
    subDept: SimpDept;
    respDept: SimpDept;
    respPerson: Person;
    status: 0 | 1;
    endFlag: 0 | 1;
    endDate: string;
    longitude: number;
    latitude: number;
    udf1: UserDefinedArchive;
    udf2: UserDefinedArchive;
    udf3: UserDefinedArchive;
    udf4: UserDefinedArchive;
    udf5: UserDefinedArchive;
    udf6: UserDefinedArchive;
    udf7: UserDefinedArchive;
    udf8: UserDefinedArchive;
    udf9: UserDefinedArchive;
    udf10: UserDefinedArchive;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: 0 | 1;
}

// Construction Site Archive Front-end Cache
export interface ConstructionSiteCache {
    queryTs: string;
    resultNumber: number;
    delItems: ConstructionSite[];
    updateItems: ConstructionSite[];
    newItems: ConstructionSite[];
    resultTs: string;
}