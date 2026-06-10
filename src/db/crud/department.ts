import { reqGetSimpDepts, reqGetSimpDeptsCache } from "../../api/department";
import { getEmptySimpDept } from "../../dataType/dataZero/department";
import { SimpDept, SimpDeptCache } from "../../dataType/types/department";
import { MasterDataRepository } from "./masterDataRespository";

// Simple Department 
export const simpDeptRepo = new MasterDataRepository<SimpDept, SimpDeptCache>({
    table: "department",
    recentTable: "department_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "ts": "ts",
    },
    emptyFn:getEmptySimpDept,
    convertToFront: (data: SimpDept[]) => data,
    getFullData: reqGetSimpDepts,
    getCacheData: reqGetSimpDeptsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});

