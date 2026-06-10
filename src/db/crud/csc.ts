import { reqGetSimpCSCList, reqGetSimpCSCCache } from "../../api/csc";
import { getEmptyCSC } from "../../dataType/dataZero/csc";
import { SimpCSC, SimpCSCCache } from "../../dataType/types/csc";
import { MasterDataRepository } from "./masterDataRespository";

// Simple Construction Site Category
export const simpCSCRepo = new MasterDataRepository<SimpCSC, SimpCSCCache>({
    table: "csc",
    recentTable: "csc_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "ts": "ts",
        "status": "status",
    },
    emptyFn: getEmptyCSC,
    convertToFront: (data: SimpCSC[]) => data,
    getFullData: reqGetSimpCSCList,
    getCacheData: reqGetSimpCSCCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});
