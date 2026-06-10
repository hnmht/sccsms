import { reqGetSimpDCList, reqGetSimpDCCache } from "../../api/dc";
import { getEmptySimpDC } from "../../dataType/dataZero/dc";
import { SimpDC, SimpDCCache } from "../../dataType/types/dc";
import { MasterDataRepository } from "./masterDataRespository";

// Simple Document Category
export const simpDCRepo = new MasterDataRepository<SimpDC, SimpDCCache>({
    table: "dc",
    recentTable: "dc_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "ts": "ts",
        "status": "status",
    },
    emptyFn: getEmptySimpDC,
    convertToFront: (data: SimpDC[]) => data,
    getFullData: reqGetSimpDCList,
    getCacheData: reqGetSimpDCCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});


